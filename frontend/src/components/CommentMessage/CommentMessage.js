import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import Accordion from "../Accordion/Accordion";
import api from "../../Config/Api";
import { useState } from "react";
import { useEffect } from "react";
import { nanoid } from "nanoid";

const CommentMessage = ({ messageId, comments, changeComment, myUserId, setAllMessages }) => {
  const [allComments, setAllComments] = useState([]);
  const [commentIcon, setCommentIcon] = useState(["far", "comment-dots"]);
  const [content, setContent] = useState("");

  useEffect(() => {
    if (comments > 0) {
      setCommentIcon(["fas", "comment-dots"]);
    }
  }, []);

  const onChangeContent = (e) => {
    setContent(e.target.value);
  };

  const onComment = async () => {
    const token = JSON.parse(JSON.stringify(sessionStorage.getItem("test")));
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
      } catch (error) {}
      // setAllComments([
      //   ...allComments,
      //   { id: nanoid(), createdAt: "à l'instant", User: { username: user.username }, content },
      // ]);
    } catch (error) {}
  };
  return (
    <div>
      <div>
        <FontAwesomeIcon color="blue" icon={commentIcon} />
        {comments}
        <div className="accordions">
          <Accordion
            setAllMessages={setAllMessages}
            title="afficher commentaires"
            content={content}
            messageId={messageId}
            allComments={allComments}
            setAllComments={setAllComments}
            myUserId={myUserId}
          />
        </div>
      </div>
      <div>
        <Input value={content} onChange={onChangeContent} label="votre commentaire" type="text" />
        <Button onClick={onComment} title="commenter" />
      </div>
    </div>
  );
};
export default CommentMessage;
