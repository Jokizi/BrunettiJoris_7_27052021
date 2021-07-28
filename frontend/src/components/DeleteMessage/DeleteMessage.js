import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import api from "../../Config/Api";
import { useState } from "react";
import ConfirmPopUp from "../ConfirmPopUp/ConfirmPopUp";

const DeleteMessage = ({ messageId, myUserId, idUserMessage, changeDeleteMessage }) => {
  const [open, setOpen] = useState(false);

  const handleModal = () => {
    setOpen(!open);
  };

  const onDeleteMessage = async () => {
    const token = JSON.parse(JSON.stringify(sessionStorage.getItem("test")));

    try {
      const response = await api({
        url: "/messages/" + messageId,
        method: "delete",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "multipart/from-data",
        },
      });
      changeDeleteMessage(messageId);
    } catch (error) {}
  };
  return (
    <div>
      {myUserId === idUserMessage && (
        <div>
          <FontAwesomeIcon onClick={handleModal} color="red" icon={["far", "trash-alt"]} />
          supprimer
        </div>
      )}
      <ConfirmPopUp
        open={open}
        confirmModalAction={onDeleteMessage}
        handleModal={handleModal}
        buttonTitle1="Oui"
        buttonTitle2="Non"
        modalTitle="Voulez vous supprimer la publication ?"
      />
    </div>
  );
};
export default DeleteMessage;
