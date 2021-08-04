import Input from "../../components/Input/Input";
import InputTextArea from "../../components/Input/InputTextARea";
import Button from "../../components/Button/Button";
import api from "../../Config/Api";
import { useState } from "react";
import FormData from "form-data";

const PostMessage = ({ viewMessagesPost }) => {
  const [file, setFile] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [resetFile, setResetFile] = useState(file.name);

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
        console.log("--------------fileName----------------------");
        console.log(file.name);
        console.log("------------------------------------");
        setTitle("");
        setContent("");
        if (file) {
          setResetFile("");
        }
        setFile("");
      } else {
        const response = await api({
          url: "/messages/new/",
          method: "post",
          data: obj,
          headers: { Authorization: `Bearer ${token}` },
        });
        viewMessagesPost(response.data);
        setTitle("");
        setContent("");
        console.log("--------------file sans photo----------------------");
        console.log(file);
        console.log("------------------------------------");
      }
    } catch (error) {}
  };

  return (
    <div>
      <Input value={title} onChange={onChangeTitle} label="Titre" type="text" />
      <Input value={resetFile} onChange={onUploadFile} type="file" />

      <InputTextArea
        id="outlined-multiline-static"
        label="Publication"
        rows={4}
        variant="outlined"
        onChange={onChangeContent}
        value={content}
      />
      <Button onClick={onPublish} title="Publier" />
    </div>
  );
};

export default PostMessage;
