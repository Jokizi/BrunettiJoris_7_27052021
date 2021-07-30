import { useState } from "react";
import "./Accordion.css";
import api from "../../Config/Api";
import LikeDislikeComment from "../LikeComment/LikeComment";
import DeleteComment from "../DeleteComment/DeleteComment";

const Accordion = ({ myUserId, title, messageId, allComments, setAllComments, setAllMessages }) => {
  const [active, setActive] = useState(false);
  const groupomaniaUser = JSON.parse(sessionStorage.getItem("groupomania-user"));
  const getAllComments = async (e) => {
    if (sessionStorage.getItem("test")) {
      const token = JSON.parse(JSON.stringify(sessionStorage.getItem("test")));

      try {
        const response = await api({
          url: "/" + messageId + "/comments",
          method: "get",
          headers: { Authorization: `Bearer ${token}` },
        });
        setAllComments(response.data);
      } catch (error) {}
    }
    setActive(!active);
  };
  // rendre dynamique les likes Comment
  const changeLikeComment = ({ commentId, commentLike, commentDislike }) => {
    const displayLike = allComments.filter((element) => {
      if (element.id === commentId) {
        element.commentLikes = commentLike;
        element.commentDislikes = commentDislike;
      }
      return element;
    });
    setAllComments(displayLike);
  };

  const changeDeleteComment = (commentId) => {
    const idToDelete = commentId;
    const displayComments = allComments.filter((element) => element.id !== idToDelete);
    setAllComments(displayComments);
  };
  return (
    <div className={`accordion ${active && "active"}`}>
      <div className="accordion__title" onClick={getAllComments}>
        {title} <span className="accordion__icon"></span>
      </div>
      <div className="accordion__content">
        {allComments.map((element) => {
          const messageCommentLikeByCurrentUser = element?.CommentsLikes?.filter(
            (elt) => groupomaniaUser.id === elt.userId
          );
          return (
            <div key={element.id}>
              <div>{element.createdAt}</div>
              <div>{element.User.username}</div>
              <div>{element.content}</div>
              <LikeDislikeComment
                changeLikeComment={changeLikeComment}
                commentLike={element.commentLikes}
                commentDislike={element.commentDislikes}
                commentId={element.id}
                messageCommentLikeByCurrentUser={messageCommentLikeByCurrentUser}
              />
              <DeleteComment
                setAllMessages={setAllMessages}
                changeDeleteComment={changeDeleteComment}
                commentId={element.id}
                messageId={messageId}
                myUserId={myUserId}
                idUserComment={element.UserId}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default Accordion;
