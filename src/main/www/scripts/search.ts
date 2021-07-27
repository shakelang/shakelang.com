import Fuse from 'fuse.js'

let searchIndex: Promise<Fuse<any>>|Fuse<any>|undefined;

async function createSearchIndex(): Promise<Fuse<any>> {
  
  // @ts-ignore
  const searchIndex =  await import("./search-index.json");
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

  let searchBarActive = false;

  document.getElementById('search-button').addEventListener('click', function() {

    const search_bar = document.getElementById('search-bar-container');
    if(!search_bar.classList.contains('shown')) {
      searchBarActive = true;
      search_bar.classList.add("shown");
      setTimeout(() => {
        document.getElementById('search-contents').focus();
      }, 200)
    }
    else {
      searchBarActive = false;
      search_bar.classList.remove("shown");
    }
  });

  const search_contents = document.getElementById('search-contents') as HTMLInputElement;
  async function change_listener() {
    console.debug((await getSearchIndex()).search(search_contents.value))
    // TODO Perform search
  }
  search_contents.addEventListener('keydown', change_listener);
  search_contents.addEventListener('keyup', change_listener);
  search_contents.addEventListener('keypress', change_listener);
  search_contents.addEventListener('change', change_listener);

});