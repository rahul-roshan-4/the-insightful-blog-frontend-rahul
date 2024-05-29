import React, { useContext, useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { formatISO9075 } from "date-fns";
import { UserContext } from "../UserContext";
import { Link } from "react-router-dom";
import Comment from "./Comment";
import Like from "./Like";

export default function PostPage() {
  const [postInfo, setPostInfo] = useState(null);
  const [likeCount, setLikeCount] = useState(0);
  const { userInfo } = useContext(UserContext);
  const [redirect, setRedirect] = useState(false);
  const [newComment, setNewComment] = useState("");
  const { id } = useParams();

  useEffect(() => {
    fetch(process.env.React_App_Host_Api + "/post/" + id)
      .then((response) => response.json())
      .then((postInfo) => {
        setPostInfo(postInfo);
      })
      .catch((error) => console.error("Error fetching post:", error));
  }, [id]);

  if (!postInfo) return "";

  const handleLike = () => {
    fetch(process.env.React_App_Host_Api + "/post/like/" + postInfo.id, {
      method: "POST",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setLikeCount(likeCount + 1);
        }
      })
      .catch((error) => console.error("Error liking post:", error));
  };

  const handleDelete = () => {
    fetch(process.env.React_App_Host_Api + "/post/" + id, {
      method: "DELETE",
      credentials: "include",
    })
      .then((response) => {
        if (response.ok) {
          setRedirect(true);
        } else {
          throw new Error("Failed to delete post");
        }
      })
      .catch((error) => {
        console.error("Error deleting post:", error);
      });
  };

  const handleAddComment = () => {
    if (!newComment.trim()) {
      return;
    }
    fetch(process.env.React_App_Host_Api + "/add-comment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        postId: id,
        text: newComment,
        // authorName: userInfo.username,
      }),
      credentials: "include",
    })
      .then((response) => response.json())
      .then((updatedPostInfo) => {
        setPostInfo(updatedPostInfo);

        setNewComment("");
      })
      .catch((error) => {
        console.error("Error adding comment:", error);
      });
  };

  if (redirect) {
    return <Navigate to={"/"} />;
  }

  return (
    <div className="post-page">
      <h1>{postInfo.title}</h1>
      {/* <time>{formatISO9075(new Date(postInfo.createdAt))}</time> */}
      <div className="author">by @{postInfo.author.username}</div>
      {userInfo.id === postInfo.author._id && (
        <div className="edit-row">
          <Link to={`/edit/${postInfo._id}`} className="edit-btn">
            <span className="icon">🖋️</span>Edit
          </Link>
          <button className="delete-btn" onClick={handleDelete}>
            <span className="icon">🗑️</span>Delete
          </button>
        </div>
      )}
      <div className="image">
        <img
          src={`${process.env.React_App_Host_Api}/${postInfo.cover}`}
          alt=""
        />
      </div>
      <div
        className="content"
        dangerouslySetInnerHTML={{
          __html: `<div style="font-size: 18px;">${postInfo.content}</div>`,
        }}
      />

      <Like postInfo={postInfo} userInfo={userInfo.id} />
      <div className="comments-section">
        <h2>Comments</h2>
        {postInfo.comments.map((comment) => (
          <Comment
            key={comment._id}
            comment={comment}
            postInfo={postInfo}
            setPostInfo={setPostInfo}
          />
        ))}

        {userInfo.id && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddComment();
            }}
            className="comment-form"
          >
            <textarea
              value={newComment}
              onChange={(e) => {
                e.preventDefault();
                setNewComment(e.target.value);
              }}
              placeholder="Add a comment..."
            />
            <button type="submit">Add Comment</button>
          </form>
        )}
      </div>
    </div>
  );
}
