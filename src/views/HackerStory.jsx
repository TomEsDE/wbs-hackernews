import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import HackerFetchApi from '../js/fetchApi';
import './hackerstory.css';
import { FaSpinner, FaArrowLeft } from 'react-icons/fa';
import Comments from '../components/Comments';

const _api = new HackerFetchApi();

export default function HackerStory() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [story, setStory] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      setError(null);
      const data = _api
        .getItem(id)
        .then((data) => {
          console.log('item: ', data);
          setStory(data);
        })
        .catch((err) => {
          setError(err);
          throw err;
        });
    } catch (error) {
      console.log('ERROR', error);
      setError(error);
    }
  }, []);

  return (
    <div className="hackerstory-div">
      <div
        className="cursor story-back"
        onClick={() => {
          navigate('/');
        }}
      >
        <FaArrowLeft /> <div> back</div>
      </div>
      {error && <div className="error">{error.message}</div>}
      {!story && !error && (
        <div className="loading-symbol">
          <FaSpinner size={70} />
        </div>
      )}

      {story && (
        <>
          <div className="story-title">{story.title}</div>
          <div className="story-subtitle">
            <div className="story-date">
              {new Date(story.created_at).toLocaleString()}
            </div>

            {story.url && (
              <a className="story-link" target="_blank" href={story.url}>
                Goto Link
              </a>
            )}
          </div>

          {story.text && (
            <div
              className="story-text"
              dangerouslySetInnerHTML={{ __html: story?.text }}
            ></div>
          )}

          {story.children && (
            <div className="comments-div">
              <Comments commentList={story.children} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
