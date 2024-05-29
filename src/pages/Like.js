import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp as solidThumbsUp, faThumbsUp as regularThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { faThumbsUp as farThumbsUp } from "@fortawesome/free-regular-svg-icons";

export default function Like({ postInfo, userInfo }) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(postInfo.likes);
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Initially assuming user is logged in
  const action = isLiked ? "unlike" : "like";

  useEffect(() => {
    setIsLiked(postInfo.likedBy.includes(userInfo));
  }, [postInfo.likes, userInfo]);

  const handleLike = () => {
    if (!userInfo) {
      // If user is not logged in, display a message
      setIsLoggedIn(false);
      return;
    }
    
    fetch(`${process.env.React_App_Host_Api}/post/like/${postInfo._id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: userInfo, action: action }),
    })
      .then((response) => response.json())
      .then((data) => {
        setLikeCount(data.likes);
        if (data.success && action === "like") {
          setIsLiked(true);
        } else {
          setIsLiked(false);
        }
      })
      .catch((error) => console.error("Error liking post:", error));
  };

  return (
    <div className="like-container">
      <button className="like-btn" onClick={handleLike}>
        <span className="icon">
          <FontAwesomeIcon icon={isLiked ? solidThumbsUp : farThumbsUp} />
        </span>
        {likeCount}
      </button>
      {!isLoggedIn && <div className="login-message">You need to login to like the post</div>}
    </div>
  );
}
