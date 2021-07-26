import { useState } from "react";
import "./Accordion.css";
import api from "../../Config/Api";
import LikeDislikeComment from "../LikeComment/LikeComment";

const Accordion = ({ title, messageId, allComments, setAllComments }) => {
  const [active, setActive] = useState(false);

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
  return (
    <div className={`accordion ${active && "active"}`}>
      <div className="accordion__title" onClick={getAllComments}>
        {title} <span className="accordion__icon"></span>
      </div>
      <div className="accordion__content">
        {allComments.map((element) => {
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
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default Accordion;
