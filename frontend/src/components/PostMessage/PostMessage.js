import React, { Component } from "react";
import Input from "../../components/Input/Input";
import InputTextArea from "../../components/Input/InputTextARea";
import Button from "../../components/Button/Button";
import api from "../../Config/Api";
import FormData from "form-data";

class PostMessage extends Component {
  constructor(props) {
    super(props);
    this.state = { file: {}, title: "", content: "", theInputKey: "" };
  }

  onUploadFile = (e) => {
    this.setState({ file: e.target.files[0] });
  };

  onChangeTitle = (e) => {
    this.setState({ title: e.target.value });
  };

  onChangeContent = (e) => {
    this.setState({ content: e.target.value });
  };

  onPublish = async () => {
    const { title, content, file } = this.state;
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
        this.props.viewMessagesPost(response.data);
        this.setState({ title: "", content: "", file: "", theInputKey: Math.random().toString(36) });
      } else {
        const response = await api({
          url: "/messages/new/",
          method: "post",
          data: obj,
          headers: { Authorization: `Bearer ${token}` },
        });
        this.props.viewMessagesPost(response.data);
        this.setState({ title: "", content: "" });
      }
    } catch (error) {}
  };

  render() {
    const { title, content } = this.state;
    return (
      <div>
        <Input value={title} onChange={this.onChangeTitle} label="Titre" type="text" />
        <div style={{ width: "350px" }}>
          <Input onChange={this.onUploadFile} type="file" theInputKey={this.state.theInputKey} />
        </div>

        <InputTextArea
          id="outlined-multiline-static"
          label="Publication"
          rows={4}
          variant="outlined"
          onChange={this.onChangeContent}
          value={content}
        />
        <Button onClick={this.onPublish} title="Publier" />
      </div>
    );
  }
}

export default PostMessage;
