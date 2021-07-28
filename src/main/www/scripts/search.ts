import Fuse from 'fuse.js'

let searchIndex: Promise<Fuse<any>>|Fuse<any>|undefined;
let si: any;

async function getSearchIndexImport() {
  
  // @ts-ignore
  if(!si) return si = await import("./search-index.json");
  else return si;

}

async function createSearchIndex(): Promise<Fuse<any>> {
  
  // @ts-ignore
  const searchIndex = await getSearchIndexImport();
  const index = Fuse.parseIndex(searchIndex.fuseIndex);
  return new Fuse(searchIndex.contents, {
    includeScore: true,
    includeMatches: true,
    isCaseSensitive: false,
    shouldSort: true
  }, index)


}

async function getSearchIndex(): Promise<Fuse<any>> {
  
  if(!searchIndex) {
    return await new Promise((rs) => {
      searchIndex = createSearchIndex().then(e => {
        rs(e);
        return e;
      });
    });
  }
  if(searchIndex instanceof Promise) {
    return await new Promise((rs) => {
      searchIndex = (searchIndex as Promise<Fuse<any>>).then(e => {
        rs(e);
        return e;
      });
    });
  }
  else return searchIndex;

}

getSearchIndex().then(console.log);


document.addEventListener('DOMContentLoaded', () => {

  const search_contents = document.getElementById('search-contents') as HTMLInputElement;
  const search_results = document.getElementById('search-results') as HTMLUListElement;
  const search_bar = document.getElementById('search-bar-container') as HTMLDivElement;
  const search_container = document.getElementById('search-container') as HTMLDivElement;

  document.getElementById('search-button').addEventListener('click', function() {

    if(!search_bar.classList.contains('shown')) {
      search_bar.classList.add("shown");
      search_results.classList.add("shown");
      setTimeout(() => {
        document.getElementById('search-contents').focus();
      }, 200)
    }
    else {
      search_bar.classList.remove("shown");
      search_results.classList.remove("shown");
    }

    return false;
  });

  document.body.addEventListener('click', (e) => {
    
    if(!search_container.contains(e.target as Node) && search_bar.classList.contains('shown')) {
      search_bar.classList.remove("shown");
      search_results.classList.remove("shown");
    }

  })

  function render_result(render: string, target: string): HTMLLIElement {
    const li = document.createElement('li');
    const a = document.createElement('a');

    const contents = document.createElement('p');
    contents.classList.add('search-result-entry-contents');
    contents.innerText = render;
    a.appendChild(contents);

    const info = document.createElement('p');
    info.classList.add('search-result-entry-info');
    info.innerText = target;
    a.appendChild(info);

    a.href = target;
    
    li.appendChild(a);
    return li;
  }

  async function getId(id: string): Promise<string> {
    return (await getSearchIndexImport()).ids[id];
  }

  async function getPage(id: string): Promise<string> {
    return (await getSearchIndexImport()).pages[id];
  }

  async function change_listener() {
    const searchResults = (await getSearchIndex()).search(search_contents.value);
    console.debug(searchResults);

    // Remove previous search results
    while (search_results.firstChild) {
      search_results.removeChild(search_results.lastChild);
    }

    await Promise.all(searchResults.slice(0, 5).map(async (e) => {
      search_results.appendChild(render_result(e.item.contents, `${await getPage(e.item.page)}#${await getId(e.item.page)}`));
    }));
  }
  search_contents.addEventListener('keydown', change_listener);
  search_contents.addEventListener('keyup', change_listener);
  search_contents.addEventListener('keypress', change_listener);
  search_contents.addEventListener('change', change_listener);

});