import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import api from "../../Config/Api";
import { useState } from "react";
import { useEffect } from "react";

const LikeDislikeComment = ({
  commentId,
  commentLike,
  commentDislike,
  changeLikeComment,
  messageCommentLikeByCurrentUser,
}) => {
  const [pushLike, setPushLike] = useState(["far", "thumbs-up"]);
  const [pushDislike, setPushDislike] = useState(["far", "thumbs-down"]);

  useEffect(() => {
    if (messageCommentLikeByCurrentUser?.length) {
      if (messageCommentLikeByCurrentUser[0].userLike) {
        setPushLike(["fas", "thumbs-up"]);
      } else if (messageCommentLikeByCurrentUser[0].userDislike) {
        setPushDislike(["fas", "thumbs-down"]);
      }
    }
  }, [messageCommentLikeByCurrentUser]);

  const onLike = async () => {
    try {
      const token = JSON.parse(JSON.stringify(sessionStorage.getItem("groupomania-token")));

      const response = await api({
        url: "/" + commentId + "/vote/like",
        method: "post",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("----------------resDataLike--------------------");
      console.log(response.data);
      console.log("------------------------------------");
      if (response.data === "like ajouté") {
        commentLike = commentLike + 1;
        setPushLike(["fas", "thumbs-up"]);
      } else if (response.data === "like retiré") {
        commentLike = commentLike - 1;
        setPushLike(["far", "thumbs-up"]);
      } else if (response.data === "dislike retiré, like ajouté") {
        commentLike = commentLike + 1;
        setPushLike(["fas", "thumbs-up"]);
        commentDislike = commentDislike - 1;
        setPushDislike(["far", "thumbs-down"]);
      }
      changeLikeComment({ commentId, commentLike, commentDislike });
    } catch (error) {}
  };

  const onDislike = async () => {
    try {
      const token = JSON.parse(JSON.stringify(sessionStorage.getItem("groupomania-token")));

      const response = await api({
        url: "/" + commentId + "/vote/dislike",
        method: "post",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("----------------resDataDislike--------------------");
      console.log(response.data);
      console.log("------------------------------------");
      if (response.data === "dislike ajouté") {
        commentDislike = commentDislike + 1;
        setPushDislike(["fas", "thumbs-down"]);
      } else if (response.data === "dislike retiré") {
        commentDislike = commentDislike - 1;
        setPushDislike(["far", "thumbs-down"]);
      } else if (response.data === "like retiré, dislike ajouté") {
        commentDislike = commentDislike + 1;
        setPushDislike(["fas", "thumbs-down"]);
        commentLike = commentLike - 1;
        setPushLike(["far", "thumbs-up"]);
      }
      changeLikeComment({ commentId, commentLike, commentDislike });
    } catch (error) {}
  };

  return (
    <div>
      <div>
        <FontAwesomeIcon onClick={onLike} color="blue" icon={pushLike} />
        {commentLike}
      </div>
      <div>
        <FontAwesomeIcon onClick={onDislike} color="red" icon={pushDislike} />
        {commentDislike}
      </div>
    </div>
  );
};
export default LikeDislikeComment;
