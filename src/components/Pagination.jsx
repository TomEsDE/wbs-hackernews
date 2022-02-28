import React, { useEffect } from 'react';

export default function Pagination({ page, nbPages, hitsPerPage, setPage }) {
  function prevPage() {
    console.log('page: ', page);
    setPage(page - 1);
  }

  function nextPage() {
    console.log('page: ', page);
    setPage(page + 1);
  }

  useEffect(() => {
    console.log('Pagination rendered');
  });

  return (
    <div className="pagination-div">
      <button onClick={prevPage}>previous</button>
      <div>Seite {page + 1}</div>
      <button onClick={nextPage}>next</button>
    </div>
  );
}
