class HackerFetchApi {
  // todo ENV
  constructor(url = 'http://hn.algolia.com/api/v1/') {
    this.url = url;
    this.searchByDateVariant = 'search_by_date';
    this.searchByDefaultVariant = 'search';
  }

  async searchByDate(
    tags = new Tags(),
    numericFilters = new NumericFilters(),
    page = 0
  ) {
    return this.search(this.searchByDateVariant, tags, numericFilters, page);
  }

  async searchByDefault(
    tags = new Tags(),
    numericFilters = new NumericFilters(),
    page = 0
  ) {
    return this.search(this.searchByDefaultVariant, tags, numericFilters, page);
  }

  async search(searchVariant, tags, numericFilters, page) {
    const resp = await fetch(
      this.buildQuery(searchVariant, tags, numericFilters, page),
      {
        method: 'GET',
        // mode: 'cors',
        // headers: {
        //   'Content-Type': 'application/json',
        // 'Access-Control-Allow-Origin': '*',
        // },
      }
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
    let queryUrl = this.url + searchVariant;
    console.log('queryUrl: ', queryUrl);
    // todo tags

    // todo numericFilters

    // todo page

    return queryUrl;
  }
}

class Tags {
  constructor() {
    this.story = '';
    this.comment = '';
    this.poll = '';
    this.pollopt = '';
    this.show_hn = '';
    this.ask_hn = '';
    this.front_page = '';
    this.author = '';
    this.story = '';
  }
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
