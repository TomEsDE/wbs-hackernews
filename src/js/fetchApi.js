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
    searchParams.searchVariant = SearchVariant.BY_DATE;
    return this.search(searchParams);
  }

  async searchByDefault(searchParams) {
    searchParams.searchVariant = SearchVariant.DEFAULT;
    return this.search(searchParams);
  }

  async search(searchParams) {
    // todo try catch und error handling
    try {
      const resp = await fetch(this.buildQuery(searchParams), (error) => {
        console.log('fetch-error: ', error);
        throw new Error(error);
      });

      // console.log('resp: ', resp);

      if (resp.ok) {
        const data = await resp.json();
        return data;
      } else {
        // todo throw error
        throw new Error('Request failed!');
      }
    } catch (error) {
      throw new Error(error);
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

    // tags -> author and storyid different
    // brackets mean 'OR'
    if (searchParams.tags.length) {
      const isAuthor = searchParams.tags.find((tag) =>
        tag.startsWith(Tags.AUTHOR)
      );
      console.log('isAuthor: ', isAuthor);

      queryUrl += `&tags=${searchParams.tags}`;
      // if (isAuthor) {
      //   queryUrl += `&tags=${searchParams.tags}`;
      // } else {
      //   // mit Brackets -> OR search
      //   queryUrl += `&tags=(${searchParams.tags})`;
      // }
    }

    // numericFilters
    if (searchParams.numericFilters?.length) {
      const nfs = searchParams.numericFilters.map((nf) => {
        // console.log('type of nf.value: ', typeof nf.value);
        let value = nf.value;
        if (typeof value === 'object') {
          value = value.f();
        }
        console.log(`nf.value von Typ ${nf.value.name}: `, value);
        return `${nf.field}${nf.numericalCondition}${nf.value.f()}`;
      });
      // console.log('nfs: ' + nfs);
      queryUrl += `&numericFilters=${nfs}`;
    }

    // page
    if (searchParams.page) {
      queryUrl += `&page=${searchParams.page}`;
    }

    // todo additional parameters like number-of-hits-per-page etc

    console.log('>>>> queryUrl: ', queryUrl);
    return queryUrl;
    // return '';
  }
}

const SearchVariant = {
  BY_DATE: 'search_by_date',
  DEFAULT: 'search',
};

const TimesInSeconds = {
  DAY: {
    name: 'DAY',
    f: () => Math.floor((Date.now() - 1000 * 60 * 60 * 24) / 1000),
  },
  WEEK: {
    name: 'WEEK',
    f: () => Math.floor((Date.now() - 1000 * 60 * 60 * 24 * 7) / 1000),
  },
  MONTH: {
    name: 'MONTH',
    f: () => Math.floor((Date.now() - 1000 * 60 * 60 * 24 * 7 * 4) / 1000),
  },
  YEAR: {
    name: 'YEAR',
    f: () => Math.floor((Date.now() - 1000 * 60 * 60 * 24 * 7 * 52) / 1000),
  },
  ALL: { name: 'ALL', f: () => 0 },
};
class SearchParams {
  constructor(
    searchVariant = SearchVariant.DEFAULT,
    query = '',
    tags = [Tags.STORY],
    numericFilters = [
      NumericFilter.create(NumericFilters.CREATED_AT_I).greaterEqualThan(
        TimesInSeconds.DAY
      ),
    ],
    page = 0
  ) {
    this.searchVariant = searchVariant;
    this.query = query;
    this.tags = tags;
    this.numericFilters = numericFilters;
    // this.numericFilters = []; // ! temp
    this.page = page;
  }

  static create(searchVariant, query, tags, numericFilters, page) {
    return new SearchParams(searchVariant, query, tags, numericFilters, page);
  }

  static default() {
    return new SearchParams();
  }

  static query(query, searchParams = new SearchParams()) {
    const sp = searchParams;

    sp.tags = sp.tags.filter((tag) => !tag.startsWith(Tags.AUTHOR)); // todo
    sp.query = query;
    sp.page = 0;

    return sp;
  }

  static page(page, searchParams) {
    const sp = searchParams;
    // sp.query = query;
    sp.page = page;

    return sp;
  }

  static author(author, searchParams) {
    const sp = new SearchParams(); // clone wegen useState
    // sp.query = query;
    sp.query = '';
    sp.tags = [Tags.STORY, `${Tags.AUTHOR}${author}`];
    // sp.numericFilters = searchParams.numericFilters;
    sp.numericFilters = [
      NumericFilter.create(NumericFilters.CREATED_AT_I).greaterEqualThan(
        TimesInSeconds.YEAR
      ),
    ];
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
  NONE: '',
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
export {
  SearchVariant,
  Tags,
  NumericFilters,
  NumericFilter,
  SearchParams,
  TimesInSeconds,
};
