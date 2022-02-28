import mock from './hackernews.json';

console.log(mock);
class HackerFetchApi {
  // todo ENV
  constructor(url = 'http://hn.algolia.com/api/v1/') {
    this.url = url;
  }

  async getMockData() {
    // zu Testzwecken ein Delay (für loading-symbol)
    const loadMock = async (time) =>
      setTimeout(() => {
        //... wait
      }, time);

    await loadMock(2000);

    return mock;
  }

  async searchByDate(
    tags = [Tags.STORY],
    numericFilters = new NumericFilters(),
    page = 0
  ) {
    return this.search(searchVariant.BY_DATE, tags, numericFilters, page);
  }

  async searchByDefault(
    tags = [Tags.STORY],
    numericFilters = new NumericFilters(),
    page = 0
  ) {
    return this.search(searchVariant.DEFAULT, tags, numericFilters, page);
  }

  async search(searchVariant, tags, numericFilters, page) {
    const resp = await fetch(
      this.buildQuery(searchVariant, tags, numericFilters, page)
    );

    // console.log('resp: ', resp);

    if (resp.ok) {
      const data = await resp.json();
      return data;
    } else {
      // todo throw error
    }
  }

  buildQuery(searchVariant, tags, numericFilters, page) {
    let queryUrl = this.url + searchVariant + '?';

    // todo tags -> author and storyid different
    if (tags.length) {
      queryUrl += `tags=(${tags})`;
    }

    // todo numericFilters
    // ...

    // todo page
    // ...

    // todo additional parameters like number-of-hits-per-page etc

    console.log('>>>> queryUrl: ', queryUrl);
    return queryUrl;
    // return '';
  }
}

const searchVariant = {
  BY_DATE: 'search_by_date',
  DEFAULT: 'search',
};

const Tags = {
  STORY: 'story',
  COMMENT: 'comment',
  POLL: 'poll',
  POLLOPT: 'pollopt',
  SHOW_HN: 'show_hn',
  ASK_HN: 'ask_hn',
  FRONT_PAGE: 'front_page',
  AUTHOR: 'author_',
  STORYID: 'story_',
};

class Tag {
  constructor() {}
}

class NumericFilters {
  constructor() {
    this.created_at_i = null;
    this.points = null;
    this.num_comments = null;
  }
}

class NumericFilter {
  constructor() {
    this.value = '';
    this.numericalCondition = '';
  }

  static create() {
    const nf = new NumericFilter();
    return nf;
  }

  greaterThan(value) {
    this.value = value;
    this.numericalCondition = '>';
  }

  greaterEqualThan(value) {
    this.value = value;
    this.numericalCondition = '>=';
  }

  lessThan(value) {
    this.value = value;
    this.numericalCondition = '<';
  }

  lessEqualThan(value) {
    this.value = value;
    this.numericalCondition = '<=';
  }

  equalThan(value) {
    this.value = value;
    this.numericalCondition = '=';
  }
}

export default HackerFetchApi;
export { Tags, NumericFilters, NumericFilter };
