import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import api from "../../Config/Api";
import { useState } from "react";
import { useEffect } from "react";

const DeleteMessage = ({ messageId, myUserId, idUserMessage }) => {
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
    } catch (error) {}
  };
  return (
    <div>
      {myUserId === idUserMessage ? (
        <div>
          <FontAwesomeIcon onClick={onDeleteMessage} color="red" icon={["far", "trash-alt"]} />
          supprimer
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};
export default DeleteMessage;
