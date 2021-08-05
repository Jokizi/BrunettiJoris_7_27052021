import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import api from "../../Config/Api";
import { useState } from "react";
import ModifPopUp from "../ModifPopUp/ModifPopUp";
import FormData from "form-data";

const ModifyMessage = ({ myUserId, idUserMessage, messageId, title, content, attachment, setAllMessages }) => {
  const [open, setOpen] = useState(false);
  const [newFile, setNewFile] = useState(attachment);
  const [fileToSend, setFileToSend] = useState("");
  const [newTitle, setNewTitle] = useState(title);
  const [newContent, setNewContent] = useState(content);

  const handleModal = () => {
    setOpen(!open);
  };

  const onUpdate = async () => {
    const token = JSON.parse(JSON.stringify(sessionStorage.getItem("test")));
    const obj = { title: newTitle, content: newContent };
    const json = JSON.stringify(obj);
    const formData = new FormData();
    formData.append("image", fileToSend);
    formData.append("message", json);

    try {
      await api({
        url: messageId + "/update",
        method: "put",
        data: formData,
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "multipart/from-data",
        },
      });
      setOpen(!open);
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
      {myUserId === idUserMessage && (
        <div>
          <FontAwesomeIcon onClick={handleModal} color="green" icon={["far", "edit"]} />
          modifier
        </div>
      )}
      <ModifPopUp
        open={open}
        handleModal={handleModal}
        modalTitle="Modifier la publication"
        buttonTitle1="Sauvegarder Modifications"
        buttonTitle2="Annuler Modifications"
        onUpdate={onUpdate}
        newTitle={newTitle}
        newContent={newContent}
        newFile={newFile}
        setNewFile={setNewFile}
        setFileToSend={setFileToSend}
        setNewTitle={setNewTitle}
        setNewContent={setNewContent}
        attachment={attachment}
      />
    </div>
  );
};
export default ModifyMessage;
