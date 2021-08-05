import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import api from "../../Config/Api";
import { useState } from "react";
import ModifCommentPopUp from "../ModifCommentPopUp/ModifCommentPopUP";

const ModifyComment = ({ myUserId, idUserComment, commentId, content, messageId, setAllComments }) => {
  const [open, setOpen] = useState(false);
  const [newContent, setNewContent] = useState(content);

  const handleModal = () => {
    setOpen(!open);
  };
  const onUpdate = async () => {
    const token = JSON.parse(JSON.stringify(sessionStorage.getItem("test")));
    const obj = { content: newContent };

    try {
      await api({
        url: commentId + "/comment/update",
        method: "put",
        data: obj,
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      setOpen(!open);
      try {
        const response = await api({
          url: "/" + messageId + "/comments",
          method: "get",
          headers: { Authorization: `Bearer ${token}` },
        });
        setAllComments(response.data);
      } catch (error) {}
    } catch (error) {}
  };

  return (
    <div>
      {myUserId === idUserComment && (
        <div>
          <FontAwesomeIcon onClick={handleModal} color="green" icon={["far", "edit"]} />
          modifier
        </div>
      )}
      <ModifCommentPopUp
        open={open}
        handleModal={handleModal}
        onUpdate={onUpdate}
        modalTitle="Modifier votre commentaire"
        buttonTitle1="Sauvegarder Modifications"
        buttonTitle2="Annuler Modifications"
        newContent={newContent}
        setNewContent={setNewContent}
      />
    </div>
  );
};
export default ModifyComment;
