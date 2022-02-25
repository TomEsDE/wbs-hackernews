import React, { useEffect, useState } from 'react';
import HackerNav from './HackerNav';
import HackerNews from './HackerNewsElement';

export default function HackerNewsList() {
  const [newsList, setNewsList] = useState([{}]);
  const [query, setQuery] = useState();
  const [page, setPage] = useState(1);

  useEffect(() => {
    // fetch data...

    return () => {
      // todo
    };
  }, [query, page]);

  useEffect(() => {
    // todo

    return () => {
      // clean
    };
  }, [newsList]);

  return (
    <div>
      <HackerNav />
      {newsList.map((news) => (
        <HackerNews />
      ))}
    </div>
  );
}
