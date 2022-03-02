import React from 'react';
import Comments from './Comments';
import { BiSubdirectoryRight } from 'react-icons/bi';

export default function Comment({ comment }) {
  return (
    <>
      {comment.text && (
        <>
          <div className="comment-div">
            <div className="comment-date">
              {new Date(comment.created_at).toLocaleString()}
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
