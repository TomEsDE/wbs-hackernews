import React, { useEffect, useRef, useState } from 'react';
import HackerFetchApi, { Tags } from '../js/fetchApi';
import HackerNav from './HackerNav';
import HackerNews from './HackerNewsElement';
import { FaSpinner } from 'react-icons/fa';
import Pagination from './Pagination';

export default function HackerNewsList() {
  const _api = new HackerFetchApi();
  const [newsList, setNewsList] = useState(null);
  // const [page, setPage] = useState(1);

  const query = useRef('');
  const page = useRef('');

  function loadData() {
    // trigger render for loading symbol
    setNewsList(null);

    // ! mock data
    // _api?.getMockData(1000).then((data) => setNewsList(data));

    // ! real data
    _api
      ?.searchByDate(query.current, [Tags.STORY], null, page.current)
      .then((data) => {
        setNewsList(data);
        page.current = data.page;
      });
  }

  // load data initially
  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
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

  function setQueryData(queryParam) {
    console.log('query: ', queryParam);
    query.current = queryParam;
    loadData(queryParam);
  }

  function setPage(pageParam) {
    page.current = pageParam;
    loadData();
  }

  return (
    <div>
      <HackerNav setQuery={setQueryData} />
      <br />
      <Pagination
        key="1"
        page={page.current}
        nbPages={newsList?.nbPages}
        hitsPerPage={newsList?.hitsPerPage}
        setPage={setPage}
      />
      <br />
      {!newsList && <FaSpinner size={70} />}
      {newsList &&
        newsList?.hits?.map((news, index) => (
          <>
            <HackerNews key={news.objectID} news={news} />
            <br />
          </>
        ))}
      <br />
      <Pagination
        key="2"
        page={page}
        nbPages={newsList?.nbPages}
        hitsPerPage={newsList?.hitsPerPage}
        setPage={setPage}
      />
    </div>
  );
}
