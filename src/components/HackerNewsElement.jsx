import React from 'react';

export default function HackerNews({ news }) {
  return <div>- {news?.story_title} </div>;
}
