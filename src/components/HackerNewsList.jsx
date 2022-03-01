import React, { useEffect, useRef, useState } from 'react';
import HackerFetchApi, {
  NumericFilter,
  NumericFilters,
  Tags,
  SearchParams,
} from '../js/fetchApi';
import HackerNav from './HackerNav';
import HackerNews from './HackerNewsElement';
import { FaSpinner } from 'react-icons/fa';
import Pagination from './Pagination';

export default function HackerNewsList({ _api }) {
  // const _api = new HackerFetchApi();
  const [newsList, setNewsList] = useState(null);
  const [searchParams, setSearchParams] = useState(SearchParams.default());
  // const [page, setPage] = useState(1);

  // const _queryParams = useRef({
  //   query: '',
  //   tags: [Tags.STORY],
  //   numericFilters: [
  //     NumericFilter.create(NumericFilters.POINTS).greaterEqualThan(100),
  //   ],
  //   page: 0,
  // });

  async function loadData() {
    // trigger render for loading symbol
    setNewsList(null);

    // ! mock data
    // _api?.getMockData(1000).then((data) => setNewsList(data));

    // ! real data
    const data = await _api.search(searchParams);

    setNewsList(data);

    // ! Vorsicht infinite
    // _queryParams.current.page = +data.page;
    // _page.current = +data.page;
  }

  // load data initially
  useEffect(() => {
    // ! Vorsicht infinite
    loadData();
  }, [searchParams]);

  useEffect(() => {
    // ! Vorsicht infinite
    console.log('newsList: ', newsList);
  }, [newsList]);

  // useEffect(() => {
  //   // fetch data...
  //   console.log('useEffect >>> page: ', page);
  //   loadData();

  //   return () => {
  //     // todo
  //   };
  // }, [page]);

  async function setQueryData(query) {
    console.log('query: ', query);

    setSearchParams(SearchParams.query(query, searchParams)); // -> useEffect
  }

  async function setPage(page) {
    if (page < 0) {
      page = 0;
    } else if (page > newsList.nbPages) {
      page = newsList.nbPages - 1;
    }
    // _page.current = page;
    setSearchParams(SearchParams.page(page, searchParams)); // -> useEffect
  }

  async function gotoStory(id) {
    console.log('gotoStory >>> id: ', id);
    const data = await _api.getItem(id);
    console.log('data: ', data);
    // todo router
    // ...
  }

  async function gotoAuthor(author) {
    console.log('gotoAuthor >>> author: ', author);

    setSearchParams(SearchParams.author(author)); // -> useEffect
  }

  return (
    <div>
      <HackerNav setQuery={setQueryData} newsList={newsList} />

      <Pagination
        key="1"
        page={searchParams.page}
        nbPages={newsList?.nbPages}
        hitsPerPage={newsList?.hitsPerPage}
        setPage={setPage}
      />

      {!newsList && <FaSpinner size={70} />}
      {newsList &&
        newsList?.hits?.map((news, index) => (
          <>
            <HackerNews
              key={news.objectID}
              news={news}
              gotoStory={gotoStory}
              gotoAuthor={gotoAuthor}
            />
          </>
        ))}
      <Pagination
        key="2"
        page={searchParams.page}
        nbPages={newsList?.nbPages}
        hitsPerPage={newsList?.hitsPerPage}
        setPage={setPage}
      />
    </div>
  );
}
