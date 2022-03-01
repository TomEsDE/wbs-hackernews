import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import {
  NumericFilter,
  NumericFilters,
  SearchParams,
  SearchVariant,
  Tags,
  TimesInSeconds,
} from '../js/fetchApi';

const optionsTags = [
  { value: Tags.STORY, label: 'Story' },
  { value: Tags.COMMENT, label: 'Comments' },
  { value: Tags.NONE, label: 'All' },
];
const optionsVariant = [
  { value: SearchVariant.DEFAULT, label: 'Popularity' },
  { value: SearchVariant.BY_DATE, label: 'Date' },
];
const optionsDate = [
  { value: TimesInSeconds.DAY, label: 'last 24h' },
  { value: TimesInSeconds.WEEK, label: 'Past Week' },
  { value: TimesInSeconds.MONTH, label: 'Past Month' },
  { value: TimesInSeconds.YEAR, label: 'Past Year' },
  { value: TimesInSeconds.ALL, label: 'All time' },
];

/**
 * ! HackerNav Component
 *
 * @param {*} param0
 * @returns
 */
export default function HackerNav({
  setQuery,
  newsList,
  searchParams,
  setSearchParamsNav,
}) {
  // const searchParams = SearchParams.default(); // ! debug
  const [queryInput, setQueryInput] = useState('');

  const [selectTags, setSelectTags] = useState(
    searchParams.tags
      ? optionsTags.find((o) => o.value === searchParams.tags[0])
      : optionsTags[0]
  );
  const [selectVariant, setSelectVariant] = useState(
    //optionsVariant[0]);
    searchParams.searchVariant
      ? optionsVariant.filter(
          (variant) => variant.value === searchParams.searchVariant
        )
      : optionsVariant[0]
  );

  const [selectDate, setSelectDate] = useState(
    //optionsDate[0]);
    searchParams.numericFilters
      ? optionsDate.filter(
          (date) =>
            date.value.name === searchParams.numericFilters[0].value.name
        )
      : optionsDate[0]
  );

  // const searchParams = SearchParams.default();

  useEffect(() => {
    console.log('searchParams: ', searchParams);
  }, []);

  function handleQueryChange({ target }) {
    setQueryInput(target.value);
  }

  function handleFilterTagChange(selectedOption) {
    if (selectedOption.value !== selectTags.value) {
      console.log('handleFilterTagChange: ', selectedOption);
      setSelectTags(selectedOption); // -> useEffect
      // new search
      setSearchParamsNav({ ...searchParams, tags: [selectedOption.value] });
    }
  }

  function handleFilterVariantChange(selectedOption) {
    if (selectedOption.value !== selectVariant.value) {
      console.log('handleFilterVariantChange: ', selectedOption);
      setSelectVariant(selectedOption); // -> useEffect
      // new search
      setSearchParamsNav({
        ...searchParams,
        searchVariant: [selectedOption.value],
      });
    }
  }

  function handleFilterDateChange(selectedOption) {
    if (selectedOption.value !== selectDate.value) {
      console.log('handleFilterDateChange: ', selectedOption);
      setSelectDate(selectedOption); // -> useEffect
      // new search
      setSearchParamsNav({
        ...searchParams,
        numericFilters: [
          NumericFilter.create(NumericFilters.CREATED_AT_I).greaterEqualThan(
            selectedOption.value
          ),
        ],
      });
    }
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
            defaultInputValue={queryInput}
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
      <div className="hacker-nav-filter-div">
        <div className="hacker-nav-filter">
          <div>Search </div>
          <Select
            className="hacker-nav-filter-select"
            onChange={handleFilterTagChange}
            options={optionsTags}
            defaultValue={selectTags}
          />
          <div> by </div>
          <Select
            className="hacker-nav-filter-select"
            onChange={handleFilterVariantChange}
            options={optionsVariant}
            defaultValue={selectVariant}
          />
          <div> for </div>
          <Select
            className="hacker-nav-filter-select"
            onChange={handleFilterDateChange}
            options={optionsDate}
            defaultValue={selectDate}
          />
        </div>
        {newsList && <div>{newsList.nbHits} results</div>}
      </div>
    </div>
  );
}
