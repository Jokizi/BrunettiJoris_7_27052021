import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";

const CommentMessage = ({ comments }) => {
  return (
    <div>
      <div>
        <FontAwesomeIcon color="blue" icon={["far", "comment-dots"]} />
        {comments}
      </div>
      <div>
        <Input label="commentaire" type="text" />
        <Button title="commenter" />
      </div>
    </div>
  );
};
export default CommentMessage;
