import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Highlighter from 'react-highlight-words';
import {
  FaLocationArrow,
  FaLongArrowAltDown,
  FaRegArrowAltCircleDown,
} from 'react-icons/fa';
import { Duration } from 'luxon';

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
   * @returns wie lang liegt die News zurueck
   */
  function ago() {
    const diffMs = new Date() - new Date(news.created_at_i * 1000);

    // luxon lib -> thx to Martin!
    const dur = Duration.fromMillis(diffMs);

    const periods = ['year', 'month', 'day', 'hour', 'minute'];

    let returnText = 'ago';

    for (let idx in periods) {
      // console.log('period: ', periods[idx]);
      const periodDur = Math.round(dur.as(periods[idx] + 's'));
      // console.log('periodDur: ', periodDur);
      if (periodDur >= 1) {
        returnText = `${periodDur} ${periods[idx]}${
          periodDur > 1 ? 's' : ''
        } ago`;
        break;
      }
    }

    return returnText;
  }

  /**
   * danke Olin :P
   *
   * @param {} str
   * @returns
   */
  function addHighlightsToString(str) {
    if (query) {
      const r = new RegExp(`(${query})`, 'ig');
      str = str.replaceAll(r, `<span class="highlightQueryWords">$&</span>`);
    }

    return (
      <div
        className="news-div-comment"
        dangerouslySetInnerHTML={{ __html: str }}
      ></div>
    );
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
            <FaLocationArrow className="arrow" size={20} />
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
          <div className="news-div-title">
            <Highlighter
              onClick={() => {
                navigate(`/story/${news.objectID}`);
              }}
              highlightClassName="highlightQueryWords"
              searchWords={[query]}
              autoEscape={true}
              textToHighlight={news.title}
            />
          </div>
        )}

        {news.comment_text && addHighlightsToString(news.comment_text)}

        {/* {news.comment_text && (
          <div
            className="news-div-comment"
            dangerouslySetInnerHTML={{ __html: news.comment_text }}
          ></div>
        )} */}
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
