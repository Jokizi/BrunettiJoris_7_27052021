import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import api from "../../Config/Api";
import { useState } from "react";
import { useEffect } from "react";

const CommentMessage = ({ messageId, comments, changeComment }) => {
  const [commentIcon, setCommentIcon] = useState(["far", "comment-dots"]);
  useEffect(() => {
    if (comments > 0) {
      setCommentIcon(["fas", "comment-dots"]);
    }
  }, []);

  const [content, setContent] = useState("");

  const onChangeContent = (e) => {
    setContent(e.target.value);
  };

  const onComment = async () => {
    const token = JSON.parse(JSON.stringify(sessionStorage.getItem("test")));
    const obj = { content };

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
      console.log("----------------resDataComment--------------------");
      console.log(response.data.comments);
      console.log("------------------------------------");
    } catch (error) {}
  };
  return (
    <div>
      <div>
        <FontAwesomeIcon color="blue" icon={commentIcon} />
        {comments}
      </div>
      <div>
        <Input onChange={onChangeContent} label="commentaire" type="text" />
        <Button onClick={onComment} title="commenter" />
      </div>
    </div>
  );
};
export default CommentMessage;
