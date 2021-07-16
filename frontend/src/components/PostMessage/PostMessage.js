import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import api from "../../Config/Api";
import { useState } from "react";
import FormData from "form-data";

const PostMessage = ({ viewMessagesPost }) => {
  const [file, setFile] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const onUploadFile = (e) => {
    setFile(e.target.files[0]);
  };

  const onChangeTitle = (e) => {
    setTitle(e.target.value);
  };

  const onChangeContent = (e) => {
    setContent(e.target.value);
  };

  const onPublish = async () => {
    const token = JSON.parse(JSON.stringify(sessionStorage.getItem("test")));
    const obj = { title, content };
    const json = JSON.stringify(obj);
    const formData = new FormData();
    formData.append("image", file);
    formData.append("message", json);
    try {
      if (file) {
        const response = await api({
          url: "/messagesImages/new/",
          method: "post",
          data: formData,
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "multipart/from-data",
          },
        });
        viewMessagesPost(response.data);
      } else {
        const response = await api({
          url: "/messages/new/",
          method: "post",
          data: obj,
          headers: { Authorization: `Bearer ${token}` },
        });
        viewMessagesPost(response.data);
      }
    } catch (error) {}
  };

  return (
    <div>
      <Input onChange={onChangeTitle} label="Titre" type="text" />
      <Input onChange={onUploadFile} label="Photo" type="file" />
      <Input onChange={onChangeContent} label="Publication" type="text" />
      <Button onClick={onPublish} title="Publier" />
    </div>
  );
};

export default PostMessage;
