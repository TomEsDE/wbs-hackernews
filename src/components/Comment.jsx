import React from 'react';
import { useNavigate } from 'react-router-dom';
import Comments from './Comments';
import { BiSubdirectoryRight } from 'react-icons/bi';

export default function Comment({ comment }) {
  const navigate = useNavigate();
  return (
    <>
      {comment.text && (
        <>
          <div className="comment-div">
            <div className="comment-info-div">
              <div className="comment-date">
                {new Date(comment.created_at).toLocaleString()}
              </div>
              {/* <div className="divider">|</div> */}
              <div
                className="comment-date cursor"
                onClick={() => {
                  navigate(`/news/${comment.author}`);
                }}
              >
                {comment.author}
              </div>
            </div>
            <div className="comment">
              <p>
                <BiSubdirectoryRight size={19} />
              </p>
              <div dangerouslySetInnerHTML={{ __html: comment.text }}></div>
            </div>
          </div>
        </>
      )}
      {comment.children && <Comments commentList={comment.children} />}
    </>
  );
}
