import React from 'react';
import Comment from './Comment';

export default function Comments({ commentList }) {
  return (
    <div className="comments">
      {commentList?.map((comment) => {
        return <Comment key={comment.id} comment={comment} />;
      })}
    </div>
  );
}
