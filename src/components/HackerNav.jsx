import React, { useState } from 'react';

export default function HackerNav({ setQuery, newsList }) {
  const [queryInput, setQueryInput] = useState('');

  function handleQueryChange({ target }) {
    setQueryInput(target.value);
  }

  function handleSubmitQuery(event) {
    event.preventDefault();
    setQuery(queryInput);
  }

  return (
    <div className="header">
      <div className="headernav-div">
        <div className="header-logo">H</div>
        <form
          className="header-search-form"
          action="#"
          onSubmit={handleSubmitQuery}
        >
          <input
            className="headernav-input-search"
            type="text"
            name="query"
            value={queryInput}
            onChange={handleQueryChange}
            placeholder="Search for News"
            id=""
          />
          <button
            className="headernav-button-search"
            onClick={handleSubmitQuery}
          >
            search
          </button>
        </form>
      </div>
      <div className="hacker-nav-filter">
        {newsList && <div>{newsList.nbHits} results</div>}
      </div>
    </div>
  );
}
