import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './hackerstory.css';

export default function HackerStory() {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div className="hackerstory-div">
      <div>Story-ID: {id}</div>
      <button
        onClick={() => {
          navigate('/');
        }}
      >
        Back
      </button>
    </div>
  );
}
