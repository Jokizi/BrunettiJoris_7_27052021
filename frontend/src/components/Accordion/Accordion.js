import { useState } from "react";
import "./Accordion.css";
import api from "../../Config/Api";
import LikeDislikeComment from "../LikeComment/LikeComment";
import ModifyComment from "../ModifyComment/ModifyComment";
import DeleteComment from "../DeleteComment/DeleteComment";

const Accordion = ({
  myUserId,
  admin,
  title,
  messageId,
  allComments,
  setAllComments,
  setAllMessages,
  setMessagesOtherUser,
  locationState,
}) => {
  const [active, setActive] = useState(false);
  const groupomaniaUser = JSON.parse(sessionStorage.getItem("groupomania-user"));

  const getAllComments = async (e) => {
    if (sessionStorage.getItem("groupomania-token")) {
      const token = JSON.parse(JSON.stringify(sessionStorage.getItem("groupomania-token")));

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
              <div>
                <div className="avatar-picture-comment">
                  <img width="100%" height="100%" style={{ borderRadius: "50%" }} src={element.User.avatar} />
                </div>
                <div>{element.User.username}</div>
              </div>
              <div>{element.content}</div>
              <LikeDislikeComment
                changeLikeComment={changeLikeComment}
                commentLike={element.commentLikes}
                commentDislike={element.commentDislikes}
                commentId={element.id}
                messageCommentLikeByCurrentUser={messageCommentLikeByCurrentUser}
              />
              <ModifyComment
                setAllComments={setAllComments}
                myUserId={myUserId}
                idUserComment={element.UserId}
                messageId={messageId}
                commentId={element.id}
                content={element.content}
              />
              <DeleteComment
                admin={admin}
                setAllMessages={setAllMessages}
                changeDeleteComment={changeDeleteComment}
                commentId={element.id}
                messageId={messageId}
                myUserId={myUserId}
                idUserComment={element.UserId}
                setMessagesOtherUser={setMessagesOtherUser}
                locationState={locationState}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default Accordion;
