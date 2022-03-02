import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Highlighter from 'react-highlight-words';
import {
  FaLocationArrow,
  FaLongArrowAltDown,
  FaRegArrowAltCircleDown,
} from 'react-icons/fa';

export default function HackerNews({ news, gotoStory, gotoAuthor, query }) {
  const navigate = useNavigate();

  const [showStory, setShowStory] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);

  function handleShowNews(event) {
    event.preventDefault();
    // console.log('handleShowNews >> id: ', news.objectID);
    // console.log('url: ', news.url);

    gotoStory(news.objectID);
  }

  function showComments(event) {
    console.log('showComments');
    gotoStory(news.objectID);
  }

  function showAuthor(event) {
    gotoAuthor(news.author);
    // gotoStory(news.author);
  }

  function showStoryText(event) {
    // console.log('showStoryText', news.story_text);
    setFadeIn(false);
    setShowStory(!showStory);
    setTimeout(() => {
      setFadeIn(true);
    }, 50);
  }

  /**
   * todo conversion wrong
   * @returns
   */
  function ago() {
    const diffMs = new Date() - new Date(news.created_at_i * 1000);

    const diffMins = Math.round(diffMs / 60000);
    const diffHours = Math.round(diffMs / 60000 / 60);
    const diffDays = Math.round(diffMs / 60000 / 60 / 24);
    const diffMonth = Math.round(diffMs / 60000 / 60 / 24 / 30);
    const diffYears = Math.round(diffMs / 60000 / 60 / 24 / 30 / 12);

    if (diffYears >= 1) {
      return `${diffYears} year${diffYears > 1 ? 's' : ''} ago`;
    } else if (diffMonth >= 1) {
      return `${diffMonth} month ago`;
    } else if (diffDays >= 1) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours >= 1) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else {
      return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    }
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
        {news.title && (
          <Highlighter
            highlightClassName="news-div-title highlightQueryWords"
            searchWords={[query]}
            autoEscape={true}
            // textToHighlight={{ __html: news.comment_text }}
            textToHighlight={news.title}
          />
          // <div className="news-div-title" onClick={handleShowNews}>
          //   {news?.title}
          // </div>
        )}

        {news.comment_text && (
          // <>
          //   <Highlighter
          //     highlightClassName="highlightQueryWords"
          //     searchWords={[query]}
          //     autoEscape={true}
          //     // textToHighlight={{ __html: news.comment_text }}
          //     textToHighlight={news.comment_text}
          //   />
          // </>
          <div
            className="news-div-comment"
            dangerouslySetInnerHTML={{ __html: news.comment_text }}
          ></div>
        )}
      </div>
      <div className="news-div-infos">
        <div>
          {news.points} point{news.points > 1 ? 's' : ''}
        </div>
        <div>|</div>
        <div className="news-div-infos-comments" onClick={showAuthor}>
          {news.author}
        </div>
        <div>|</div>
        <div>{ago()}</div>
        <div>|</div>
        {news.num_comments > 0 && (
          <div
            className="news-div-infos-comments"
            onClick={() => {
              navigate(`/story/${news.objectID}`);
            }}
          >
            {news.num_comments} comments
          </div>
        )}
        {!news.num_comments && <div>{news.num_comments} comments</div>}
      </div>
      {showStory && (
        <div
          className={`news-div-story div-fade-in ${fadeIn && 'fade-in'}`}
          dangerouslySetInnerHTML={{ __html: news.story_text }}
        ></div>
      )}
    </div>
  );
}
