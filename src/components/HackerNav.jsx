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
  { value: [Tags.STORY], label: 'Story' },
  { value: [Tags.COMMENT], label: 'Comments' },
  // { value: [Tags.STORY, Tags.COMMENT], label: 'All' },
  { value: [], label: 'All' },
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

  const [selectTags, setSelectTags] = useState();
  const [selectVariant, setSelectVariant] = useState();
  const [selectDate, setSelectDate] = useState();

  // const searchParams = SearchParams.default();

  useEffect(() => {
    console.log('~~~~~ searchParams: ', searchParams);

    setSelectTags(
      searchParams.tags
        ? optionsTags.find((o) => o.value[0] === searchParams.tags[0])
        : optionsTags[0]
    );

    setSelectVariant(
      //optionsVariant[0]);
      searchParams.searchVariant
        ? optionsVariant.filter(
            (variant) => variant.value === searchParams.searchVariant
          )
        : optionsVariant[0]
    );

    setSelectDate(
      searchParams.numericFilters
        ? optionsDate.filter(
            (date) =>
              date.value.name ===
              searchParams.numericFilters.find(
                (nf) => nf.field === NumericFilters.CREATED_AT_I
              ).value.name
          )
        : optionsDate[0]
    );
  }, [searchParams]);

  function handleQueryChange({ target }) {
    setQueryInput(target.value);
  }

  function handleFilterTagChange(selectedOption) {
    if (selectedOption?.value !== selectTags?.value) {
      console.log('handleFilterTagChange: ', selectedOption);
      setSelectTags(selectedOption); // -> useEffect
      // new search
      setSearchParamsNav({
        ...searchParams,
        tags: selectedOption.value,
      });
    }
  }

  function handleFilterVariantChange(selectedOption) {
    if (selectedOption.value !== selectVariant.value) {
      console.log('handleFilterVariantChange: ', selectedOption);
      setSelectVariant(selectedOption); // -> useEffect
      // new search
      setSearchParamsNav({
        ...searchParams,
        tags: searchParams.tags.filter((tag) => !tag.startsWith(Tags.AUTHOR)), // author rausfiltern, falls drin
        searchVariant: selectedOption.value,
      });
    }
  }

  function handleFilterDateChange(selectedOption) {
    if (selectedOption.value !== selectDate.value) {
      console.log('handleFilterDateChange: ', selectedOption);
      setSelectDate(selectedOption); // -> useEffect
      // new search
      // todo numericFilters.map falls mehrere (-> nur CREATED_AT_I ersetzen)
      setSearchParamsNav({
        ...searchParams,
        tags: searchParams.tags.filter((tag) => !tag.startsWith(Tags.AUTHOR)), // author rausfiltern, falls drin
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
    // -> parent
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
          {/* <button
            className="headernav-button-search"
            onClick={handleSubmitQuery}
          >
            search
          </button> */}
        </form>
      </div>
      <div className="hacker-nav-filter-div">
        <div className="hacker-nav-filter">
          <div>Search </div>
          <Select
            className="hacker-nav-filter-select"
            onChange={handleFilterTagChange}
            options={optionsTags}
            value={selectTags}
          />
          <div> by </div>
          <Select
            className="hacker-nav-filter-select"
            onChange={handleFilterVariantChange}
            options={optionsVariant}
            value={selectVariant}
          />
          <div> for </div>
          <Select
            className="hacker-nav-filter-select"
            onChange={handleFilterDateChange}
            options={optionsDate}
            value={selectDate}
          />
          {/* <button onClick={testSelectChange}>Test Select Change</button> */}
        </div>
        {newsList && <div>{newsList.nbHits} results</div>}
      </div>
    </div>
  );
}
