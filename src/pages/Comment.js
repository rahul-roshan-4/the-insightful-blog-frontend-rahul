import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../UserContext";

export default function Comment({ comment, postInfo, setPostInfo }) {
  const [commentInfo, setCommentInfo] = useState("");
  const { userInfo } = useContext(UserContext);

  useEffect(() => {
    fetch(process.env.React_App_Host_Api + "/addComment/" + comment).then(
      (response) => {
        response.json().then((commentInfo) => {
          setCommentInfo(commentInfo);
          // console.log(postInfo);
        });
      }
    );
  }, [comment]);

  // const handleDelete = () => {
  //   handleDeleteComment(comment); // Call the function with the comment ID
  // };

  const deleteComment = () => {
    try {
      fetch(process.env.React_App_Host_Api + "/deletecomment/" + comment, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId: postInfo._id }),
      })
        .then((response) => response.json())
        .then((updatedPostInfo) => {
          setPostInfo(updatedPostInfo);
          // setNewComment(""); // Clear the input field after adding the comment
        });
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  return (
    <div className="comment-container">
      <div className="comment-box">
        <p className="comment-text">{commentInfo.text}</p>
      </div>
      <div className="comment-author">@{commentInfo.author?.id.username}</div>
      {userInfo?.id && commentInfo.author?.id._id === userInfo?.id && (
        <button className="delete-button small-button" onClick={deleteComment}>
          Delete
        </button>
      )}
    </div>
  );
}
