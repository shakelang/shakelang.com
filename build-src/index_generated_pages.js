// jshint esversion: 9
const cheerio = require('cheerio');
const glob = require("glob-promise");
const fs = require('fs-extra');
const fuse = require('fuse.js');


/**
 * Find the latest id before an element
 * 
 * @param {cheerio.Cheerio} it the component to search an id for
 * @param {cheerio.Root} $ the root cheerio element
 * @returns The latest id before an element
 */
function findLatestId(it, $) {
  if(['body', 'html'].includes(it.get()[0].name)) return null;
  if(it.attr('id')) return it.attr('id');
  else {
    let id;
    $(it.prevAll().get().reverse()).each(e => {
      if(!id && $(e).attr('id')) {
        id = $(e).attr('id');
        return false;
      }
    });
    if(id) return id;
    else return findLatestId(it.parent(), $);
  }
}

class SearchIndex {

  constructor(index = {pages: [], ids: [], contents: []}) {
    this.index = index;
  }

  getPage(page) {
    if(this.index.pages.includes(page)) return this.index.pages.indexOf(page);
    else return this.index.pages.push(page);
  }

  getId(id) {
    if(this.index.ids.includes(id)) return this.index.ids.indexOf(id);
    else return this.index.ids.push(id);
  }

  /**
   * Add a component to the search index
   * 
   * @param {string} contents 
   * @param {string} page
   */
  add(contents, page) {
    const $ = cheerio.load(contents);
    this.runIndexer($("body"), $, page);
  }
  
  /**
   * Run the indexer over an element
   * 
   * @param {cheerio.Cheerio} it the element to index
   * @param {cheerio.Root} $ the root cheerio element
   * @param {string} page the page the elements are located in 
   */
  runIndexer(it, $, page) {

    const directInnerText = it
      .clone()
      .children()
        //.filter((e) => !['b', 'strong', 'i', 'em', 'mark', 'small', 'del', 'ins', 'sub', 'sup'].includes(e.name))
        .remove()
      .end()
      .text();

    if(directInnerText != null && directInnerText.replace(/\n|\r| |\t/g, '') != '') {
      this.index.contents.push({ 
        page: this.getPage(page), 
        findAt: this.getId(findLatestId(it, $)), 
        contents: it.text(), 
      });
    }
    else
      it.children()
        .each((_i, e) => this.runIndexer($(e), $, page));
  }

  toMap() {
    return {
      ...this.index,
      fuseIndex: fuse.createIndex(['contents'], this.index.contents).toJSON()
    };
  }

  toJson() {
    return JSON.stringify(this.toMap());
  }

}

/**
 * 
 * @param {string} path 
 * @returns {SearchIndex}
 */
async function indexGeneratedPages(path) {
  const index = new SearchIndex();
  await glob.promise(path+'/**/*.html')
    .then(e => Promise.all(e.map(async (file) => ({file: file.substr(path.length+1), contents: (await fs.readFile(file)).toString()}))))
    .then(e => e.forEach(e => index.add(e.contents, e.file)));
  return index;
}

module.exports = indexGeneratedPages;