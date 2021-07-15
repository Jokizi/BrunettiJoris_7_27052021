import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import api from "../../Config/Api";
import { useState } from "react";

const PostMessage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const onChangeTitle = (e) => {
    setTitle(e.target.value);
  };

  const onChangeContent = (e) => {
    setContent(e.target.value);
  };

  const onPublish = async () => {
    const token = JSON.parse(JSON.stringify(sessionStorage.getItem("test")));
    try {
      const obj = { title, content };
      const response = await api({
        url: "/messages/new/",
        method: "post",
        data: obj,
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {}
  };

  return (
    <div>
      <Input onChange={onChangeTitle} label="Titre" type="text" />
      <Input label="Photo" type="file" />
      <Input onChange={onChangeContent} label="Publication" type="text" />
      <Button onClick={onPublish} title="Publier" />
    </div>
  );
};

export default PostMessage;
