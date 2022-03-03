import { useEffect, useState } from 'react';
import { FaSpinner } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import { SearchParams } from '../js/fetchApi';
import HackerNav from './HackerNav';
import HackerNews from './HackerNewsElement';
import Pagination from './Pagination';

/**
 *
 * @param {*} param0
 * @returns
 */
export default function HackerNewsList({ _api }) {
  const navigate = useNavigate();
  const { author } = useParams();

  // const _api = new HackerFetchApi();
  const [newsList, setNewsList] = useState(null);
  const [searchParams, setSearchParams] = useState(null);
  const [error, setError] = useState(null);

  async function loadData() {
    // trigger render for loading symbol
    setNewsList(null);

    // ! mock data
    // _api?.getMockData(1000).then((data) => setNewsList(data));

    // ! real data
    if (!searchParams) return;

    try {
      setError(null);
      const data = await _api.search(searchParams);
      // ! Vorsicht infinite
      setNewsList(data);
    } catch (error) {
      console.log('ERROR', error);
      setError(error);
    }
  }

  // load data initially
  useEffect(() => {
    // ! Vorsicht infinite
    // console.log('--------- searchParams', searchParams);
    if (author) {
      gotoAuthor(author, true);
    } else {
      setSearchParams(SearchParams.default());
    }
  }, []);

  // load data initially
  useEffect(() => {
    // ! Vorsicht infinite
    // console.log('--------- searchParams', searchParams);
    loadData();
  }, [searchParams]);

  useEffect(() => {
    // ! Vorsicht infinite
    console.log('newsList: ', newsList);
  }, [newsList]);

  async function setQueryData(query) {
    console.log('query: ', query);

    // todo temporär bis filter implementiert
    // const sp = SearchParams.default();

    setSearchParams(SearchParams.query(query, { ...searchParams })); // -> useEffect
  }

  async function setPage(page) {
    if (page < 0) {
      page = 0;
    } else if (page > newsList.nbPages) {
      page = newsList.nbPages - 1;
    }

    setSearchParams(SearchParams.page(page, { ...searchParams })); // -> useEffect
  }

  async function setSearchParamsNav(searchParams) {
    console.log('--------- setSearchParamsNav', searchParams);
    setSearchParams(searchParams); // -> useEffect
  }

  async function gotoStory(id) {
    console.log('gotoStory >>> id: ', id);
    const data = await _api.getItem(id);
    console.log('data: ', data);
    // todo router
    // ...
  }

  async function gotoAuthor(author, showComments = false) {
    console.log('gotoAuthor >>> author: ', searchParams);
    setSearchParams(SearchParams.author(author, searchParams, showComments)); // -> useEffect
  }

  return (
    <div>
      <HackerNav
        setQuery={setQueryData}
        newsList={newsList}
        searchParams={searchParams}
        setSearchParamsNav={setSearchParamsNav}
      />

      <Pagination
        key="1"
        page={searchParams?.page}
        nbPages={newsList?.nbPages}
        hitsPerPage={newsList?.hitsPerPage}
        setPage={setPage}
      />
      {error && <div className="error">{error.message}</div>}
      {newsList && newsList.hits.length === 0 && (
        <div className="noresult">No Results</div>
      )}

      {!newsList && !error && (
        <div className="loading-symbol">
          <FaSpinner size={70} />
        </div>
      )}
      {true &&
        newsList &&
        newsList?.hits?.map((news, index) => (
          <>
            <HackerNews
              key={news.objectID}
              news={news}
              gotoStory={gotoStory}
              gotoAuthor={gotoAuthor}
              query={searchParams?.query}
            />
          </>
        ))}
      <Pagination
        key="2"
        page={searchParams?.page}
        nbPages={newsList?.nbPages}
        hitsPerPage={newsList?.hitsPerPage}
        setPage={setPage}
      />
    </div>
  );
}
