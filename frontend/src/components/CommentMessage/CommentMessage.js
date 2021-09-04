import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import Accordion from "../Accordion/Accordion";
import api from "../../Config/Api";
import { useState } from "react";
import { useEffect } from "react";
import { toastTrigger } from "../../helper/toast";
import "./commentMessage.css";

const CommentMessage = ({
  messageId,
  admin,
  comments,
  changeComment,
  myUserId,
  setAllMessages,
  setMessagesOtherUser,
  locationState,
}) => {
  const [allComments, setAllComments] = useState([]);
  const [commentIcon, setCommentIcon] = useState(["far", "comment-dots"]);
  const [content, setContent] = useState("");

  useEffect(() => {
    if (comments > 0) {
      setCommentIcon(["fas", "comment-dots"]);
    }
  }, [comments]);

  const onChangeContent = (e) => {
    setContent(e.target.value);
  };

  const onComment = async () => {
    if (!content) {
      toastTrigger("error", "Une erreur est survenue ⛔️");
      return;
    }
    const token = JSON.parse(JSON.stringify(sessionStorage.getItem("groupomania-token")));
    const obj = { content };
    const user = JSON.parse(sessionStorage.getItem("groupomania-user"));
    try {
      const response = await api({
        url: "/" + messageId + "/comments/new/",
        method: "post",
        data: obj,
        headers: { Authorization: `Bearer ${token}` },
      });

      comments = response.data.comments;
      setCommentIcon(["fas", "comment-dots"]);

      changeComment({ messageId, comments });
      try {
        const response = await api({
          url: "/" + messageId + "/comments",
          method: "get",
          headers: { Authorization: `Bearer ${token}` },
        });
        setAllComments(response.data);
        setContent("");
        toastTrigger("success", "Commentaire ajouté 👌🏼");
      } catch (error) {}
    } catch (error) {
      toastTrigger("error", "Une erreur est survenue ⛔️");
    }
  };
  return (
    <div>
      <div className="comment-icon">
        <FontAwesomeIcon color="blue" icon={commentIcon} />
        {comments}
      </div>
      <div className="accordions">
        <Accordion
          admin={admin}
          setAllMessages={setAllMessages}
          title="afficher commentaires"
          content={content}
          messageId={messageId}
          allComments={allComments}
          setAllComments={setAllComments}
          myUserId={myUserId}
          setMessagesOtherUser={setMessagesOtherUser}
          locationState={locationState}
        />
      </div>
      <div className="comment-input-button">
        <div className="comment-input">
          <Input value={content} onChange={onChangeContent} label="votre commentaire" type="text" />
        </div>
        <div className="comment-button">
          <Button onClick={onComment} title="commenter" />
        </div>
      </div>
    </div>
  );
};
export default CommentMessage;
