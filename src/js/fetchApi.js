import mock from './hackernews.json';

class HackerFetchApi {
  // todo ENV
  constructor(url = 'http://hn.algolia.com/api/v1/') {
    this.url = url;
  }

  getMockDataSync() {
    return mock;
  }

  async getMockData(time = 1000) {
    // zu Testzwecken ein Delay (für loading-symbol)
    async function loadMock(time) {
      return new Promise((resolve) => {
        console.log('...wait');
        setTimeout(() => {
          resolve('resolved');
        }, time);
      });
    }

    // delay-Promise aufrufen und abwarten (await -> funktioniert nur in asynchronen Funktionen)
    await loadMock(time);
    console.log('waited!');

    // asynchrone Funktionen liefern IMMER ein Promise (kann dann mit '.then()' aufgelöst werden)
    return mock;
  }

  async searchByDate(searchParams) {
    return this.search(searchParams);
  }

  async searchByDefault(searchParams) {
    return this.search(searchParams);
  }

  async search(searchParams) {
    const resp = await fetch(this.buildQuery(searchParams));

    // console.log('resp: ', resp);

    if (resp.ok) {
      const data = await resp.json();
      return data;
    } else {
      // todo throw error
    }
  }

  async getItem(id) {
    const resp = await fetch(`${this.url}items/${id}`);

    // console.log('resp: ', resp);

    if (resp.ok) {
      const data = await resp.json();
      return data;
    } else {
      // todo throw error
    }
  }

  buildQuery(searchParams) {
    let queryUrl = `${this.url}${searchParams.searchVariant}?`;

    console.table(searchParams);

    // input search
    if (searchParams.query?.trim().length) {
      queryUrl += `query=${searchParams.query}`;
    }

    // todo tags -> author and storyid different
    // brackets mean 'OR'
    if (searchParams.tags.length) {
      queryUrl += `&tags=${searchParams.tags}`;
    }

    // todo numericFilters
    if (searchParams.numericFilters?.length) {
      const nfs = searchParams.numericFilters.map(
        (nf) => `${nf.field}${nf.numericalCondition}${nf.value}`
      );
      console.log('nfs: ' + nfs);
      queryUrl += `&numericFilters=${nfs}`;
    }

    // todo page
    // ...
    if (searchParams.page) {
      queryUrl += `&page=${searchParams.page}`;
    }

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

const timesInSeconds = {
  WEEK: Math.floor((Date.now() - 1000 * 60 * 60 * 24 * 7) / 1000),
  MONTH: Math.floor((Date.now() - 1000 * 60 * 60 * 24 * 7 * 31) / 1000),
};
class SearchParams {
  constructor() {
    this.searchVariant = searchVariant.DEFAULT;
    this.query = '';
    this.tags = [Tags.STORY];
    this.numericFilters = [
      NumericFilter.create(NumericFilters.CREATED_AT_I).greaterEqualThan(
        timesInSeconds.WEEK
      ),
    ];
    this.page = 0;
  }

  static default() {
    return new SearchParams();
  }

  static query(query, searchParams = new SearchParams()) {
    const sp = { ...searchParams }; // clone wegen useState

    sp.tags = [Tags.STORY]; // todo sollte von ui kommen
    sp.query = query;
    sp.page = 0;

    return sp;
  }

  static page(page, searchParams) {
    const sp = { ...searchParams }; // clone wegen useState
    // sp.query = query;
    sp.page = page;

    return sp;
  }

  static author(author) {
    const sp = new SearchParams(); // clone wegen useState
    // sp.query = query;
    sp.query = '';
    sp.tags = [Tags.STORY, `${Tags.AUTHOR}${author}`];
    sp.numericFilters = null;
    sp.page = 0;

    return sp;
  }
}

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

const NumericFilters = {
  CREATED_AT_I: 'created_at_i',
  POINTS: 'points',
  NUM_COMMENTS: 'num_comments',
};

class NumericFilter {
  constructor(field) {
    this.field = field;
    this.value = '';
    this.numericalCondition = '';
  }

  static create(field) {
    const nf = new NumericFilter(field);
    return nf;
  }

  greaterThan(value) {
    this.value = value;
    this.numericalCondition = '>';
    return this;
  }

  greaterEqualThan(value) {
    this.value = value;
    this.numericalCondition = '>=';
    return this;
  }

  lessThan(value) {
    this.value = value;
    this.numericalCondition = '<';
    return this;
  }

  lessEqualThan(value) {
    this.value = value;
    this.numericalCondition = '<=';
    return this;
  }

  equalThan(value) {
    this.value = value;
    this.numericalCondition = '=';
    return this;
  }
}

export default HackerFetchApi;
export { Tags, NumericFilters, NumericFilter, SearchParams };
