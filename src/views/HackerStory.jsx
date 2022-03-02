import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import HackerFetchApi from '../js/fetchApi';
import './hackerstory.css';
import { FaSpinner } from 'react-icons/fa';

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
      <button
        onClick={() => {
          navigate('/');
        }}
      >
        Back
      </button>
      {error && <div className="error">{error.message}</div>}
      {!story && !error && (
        <div className="loading-symbol">
          <FaSpinner size={70} />
        </div>
      )}

      <div>{story?.title}</div>
      {story?.text && (
        <div dangerouslySetInnerHTML={{ __html: story?.text }}></div>
      )}
    </div>
  );
}
