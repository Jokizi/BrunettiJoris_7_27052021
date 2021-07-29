import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import api from "../../Config/Api";
import { useState } from "react";
import ConfirmPopUp from "../ConfirmPopUp/ConfirmPopUp";

const DeleteComment = ({ messageId, commentId, myUserId, idUserComment, changeDeleteComment, setAllMessages }) => {
  const [open, setOpen] = useState(false);

  const handleModal = () => {
    setOpen(!open);
  };

  const onDeleteComment = async () => {
    const token = JSON.parse(JSON.stringify(sessionStorage.getItem("test")));

    try {
      const response = await api({
        url: `/user/${messageId}/${commentId}`,
        method: "delete",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "multipart/from-data",
        },
      });
      changeDeleteComment(commentId);
      try {
        const response = await api({
          url: "/messages/",
          method: "get",
          headers: { Authorization: `Bearer ${token}` },
        });
        setAllMessages(response.data);
      } catch (error) {}
    } catch (error) {}
  };

  return (
    <div>
      {myUserId === idUserComment && (
        <div>
          <FontAwesomeIcon onClick={handleModal} color="red" icon={["far", "trash-alt"]} />
          supprimer
        </div>
      )}
      <ConfirmPopUp
        open={open}
        confirmModalAction={onDeleteComment}
        handleModal={handleModal}
        buttonTitle1="Oui"
        buttonTitle2="Non"
        modalTitle="Voulez vous supprimer le commentaire ?"
      />
    </div>
  );
};
export default DeleteComment;
