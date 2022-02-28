import React, { useEffect } from 'react';
import {
  FaFastForward,
  FaForward,
  FaBackward,
  FaFastBackward,
} from 'react-icons/fa';

export default function Pagination({ page, nbPages, hitsPerPage, setPage }) {
  function prevPage() {
    console.log('page: ', page);
    setPage(+page - 1);
  }

  function nextPage() {
    console.log('page: ', page);
    setPage(+page + 1);
  }

  useEffect(() => {
    console.log('Pagination rendered');
  });

  return (
    <div className="pagination-div">
      <button onClick={() => setPage(+page - 10)} disabled={+page === 0}>
        <FaFastBackward />
      </button>
      <button onClick={() => setPage(+page - 1)} disabled={+page === 0}>
        <FaBackward />
      </button>
      <div>
        Seite {+page + 1} {nbPages && `/ ${nbPages}`}
      </div>
      <button
        onClick={() => setPage(+page + 1)}
        disabled={+page === nbPages - 1}
      >
        <FaForward />
      </button>
      <button
        onClick={() => setPage(+page + 10)}
        disabled={+page === nbPages - 1}
      >
        <FaFastForward />
      </button>
    </div>
  );
}
