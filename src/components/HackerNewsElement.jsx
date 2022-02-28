import React, { useState } from 'react';
import {
  FaLocationArrow,
  FaLongArrowAltDown,
  FaRegArrowAltCircleDown,
} from 'react-icons/fa';

export default function HackerNews({ news }) {
  const [showStory, setShowStory] = useState(false);

  function handleShowNews(event) {
    event.preventDefault();
    console.log('handleShowNews >> id: ', news.objectID);
    console.log('url: ', news.url);
  }

  function showComments(event) {
    console.log('showComments');
  }

  function showStoryText(event) {
    console.log('showStoryText', news.story_text);
    setShowStory(!showStory);
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
        {news.url && (
          <a
            className="news-div-link-origin"
            href={news.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLocationArrow size={20} />
          </a>
        )}
        {news.story_text && (
          <div
            className="news-div-infos-comments"
            onClick={showStoryText}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLocationArrow className="arrow-turn" size={20} />
          </div>
        )}
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
      {showStory && (
        <div
          className="news-div-story"
          dangerouslySetInnerHTML={{ __html: news.story_text }}
        ></div>
      )}
    </div>
  );
}
