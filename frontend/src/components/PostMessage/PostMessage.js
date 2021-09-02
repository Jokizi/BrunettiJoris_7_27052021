import React, { Component } from "react";
import Input from "../../components/Input/Input";
import InputTextArea from "../../components/Input/InputTextARea";
import Button from "../../components/Button/Button";
import api from "../../Config/Api";
import FormData from "form-data";
import { toastTrigger } from "../../helper/toast";
import "./PostMessage.css";

class PostMessage extends Component {
  constructor(props) {
    super(props);
    this.state = { file: "", title: "", content: "", theInputKey: "" };
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
    if (!title || !content) {
      toastTrigger("error", "Une erreur est survenue ⛔️");
      return;
    }
    const token = JSON.parse(JSON.stringify(sessionStorage.getItem("groupomania-token")));

    const obj = { title, content };
    const json = JSON.stringify(obj);
    const formData = new FormData();
    formData.append("image", file);
    formData.append("message", json);
    if (this.props.isProfil) {
      try {
        if (file) {
          await api({
            url: "/messagesImages/new/",
            method: "post",
            data: formData,
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
              "Content-Type": "multipart/from-data",
            },
          });
          const response = await api({
            url: "/user/messages",
            method: "get",
            headers: { Authorization: `Bearer ${token}` },
          });
          this.props.viewMessagesPost(response.data);
          this.setState({ title: "", content: "", file: "", theInputKey: Math.random().toString(36) });
          toastTrigger("success", "Publication ajouté 👌🏼");
        } else {
          await api({
            url: "/messages/new/",
            method: "post",
            data: obj,
            headers: { Authorization: `Bearer ${token}` },
          });
          const response = await api({
            url: "/user/messages",
            method: "get",
            headers: { Authorization: `Bearer ${token}` },
          });
          this.props.viewMessagesPost(response.data);
          this.setState({ title: "", content: "" });
          toastTrigger("success", "Publication ajouté 👌🏼");
        }
      } catch (error) {
        toastTrigger("error", "Une erreur est survenue ⛔️");
      }
    } else {
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
          toastTrigger("success", "Publication ajouté 👌🏼");
        } else {
          const response = await api({
            url: "/messages/new/",
            method: "post",
            data: obj,
            headers: { Authorization: `Bearer ${token}` },
          });
          this.props.viewMessagesPost(response.data);
          this.setState({ title: "", content: "" });
          toastTrigger("success", "Publication ajouté 👌🏼");
        }
      } catch (error) {
        toastTrigger("error", "Une erreur est survenue ⛔️");
      }
    }
  };

  render() {
    const { title, content } = this.state;
    return (
      <div className="post-message">
        <div className="post-message-title">Échanger avec vos collaborateurs</div>
        <div className="input-container">
          <div className="input-title">
            <Input value={title} onChange={this.onChangeTitle} label="Titre" type="text" />
          </div>
          <div className="input-file">
            <Input onChange={this.onUploadFile} type="file" theInputKey={this.state.theInputKey} />
          </div>
          <div className="input-content">
            <InputTextArea
              id="outlined-multiline-static"
              label="Publication"
              rows={1}
              variant="outlined"
              onChange={this.onChangeContent}
              value={content}
            />
          </div>
        </div>
        <div className="button-publish">
          <Button onClick={this.onPublish} title="Publier" />
        </div>
      </div>
    );
  }
}

export default PostMessage;
