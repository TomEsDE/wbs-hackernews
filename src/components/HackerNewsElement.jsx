import { Duration } from 'luxon';
import { useState } from 'react';
import Highlighter from 'react-highlight-words';
import { FaLocationArrow } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function HackerNews({ news, gotoStory, gotoAuthor, query }) {
  const navigate = useNavigate();

  const [showStory, setShowStory] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);

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

  function getUrl() {
    if (news.url) return news.url;
    else return news.story_url;
  }

  return (
    <div className="news-div">
      <div className="news-div-link-div">
        {news.url && getUrl() && (
          <a
            className="news-div-link-origin"
            href={getUrl()}
            target="_blank"
            rel="noopener noreferrer"
            title="open external link"
          >
            <FaLocationArrow className="arrow" size={20} />
          </a>
        )}

        {news.comment_text && (
          <div
            className="news-div-link-origin"
            onClick={() => {
              navigate(`/story/${news.story_id}`);
            }}
            title="goto Story"
          >
            <FaLocationArrow className="arrow" size={20} />
          </div>
        )}
        {news.story_text && (
          <div
            className="news-div-infos-comments"
            onClick={showStoryText}
            target="_blank"
            rel="noopener noreferrer"
            title="show story text"
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
        {news.title && (
          <>
            <div>
              {news.points} point{news.points > 1 ? 's' : ''}
            </div>
            <div>|</div>
          </>
        )}
        <div className="news-div-infos-comments" onClick={showAuthor}>
          {news.author}
        </div>
        <div>|</div>
        <div>{ago()}</div>
        {news.num_comments > 0 && (
          <>
            <div>|</div>
            <div
              className="news-div-infos-comments"
              onClick={() => {
                navigate(`/story/${news.objectID}`);
              }}
            >
              {news.num_comments} comments
            </div>
          </>
        )}
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
