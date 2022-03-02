import React from 'react';
import Footer from '../components/Footer';
import HackerNewsList from '../components/HackerNewsList';
import HackerFetchApi from '../js/fetchApi';
import './hackernews.css';

export default function HackerNews() {
  return (
    <div className="App">
      <HackerNewsList _api={new HackerFetchApi()} />
      <Footer />
    </div>
  );
}
