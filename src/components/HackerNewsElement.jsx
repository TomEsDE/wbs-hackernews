import React from 'react';
import { FaLocationArrow } from 'react-icons/fa';

export default function HackerNews({ news }) {
  function handleShowNews(event) {
    event.preventDefault();
    console.log('handleShowNews >> id: ', news.objectID);
    console.log('url: ', news.url);
  }

  function showComments(event) {
    console.log('showComments');
  }

  /**
   * todo conversion wrong
   * @returns
   */
  function ago() {
    // console.log('news.created_at_i: ', new Date(news.created_at).getTime());
    const diffMs = Date.now() - new Date(news.created_at).getTime();
    // console.log('diffMs: ', diffMs);
    const diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);
    // console.log('diffMins: ', diffMins);
    return diffMins;
  }

  return (
    <div className="news-div">
      <div className="news-div-link-div">
        <a
          className="news-div-link-origin"
          href={news.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaLocationArrow size={20} />
        </a>
        <div className="news-div-link" onClick={handleShowNews}>
          {news?.title}
        </div>
      </div>
      <div className="news-div-infos">
        <div>
          {news.points} point{news.points > 1 ? 's' : ''}
        </div>
        <div>|</div>
        <div>{news.author}</div>
        <div>|</div>
        <div>{ago()} minutes ago</div>
        <div>|</div>
        {news.num_comments > 0 && (
          <div className="news-div-infos-comments" onClick={showComments}>
            {news.num_comments} comments
          </div>
        )}
        {!news.num_comments && <div>{news.num_comments} comments</div>}
      </div>
    </div>
  );
}
