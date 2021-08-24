import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import api from "../../Config/Api";
import LikeDislikeMessage from "../../components/LikeMessage/LikeMessage";
import CommentMessage from "../../components/CommentMessage/CommentMessage";
import ModifyMessage from "../../components/ModifyMessage/ModifyMessage";
import DeleteMessage from "../../components/DeleteMessage/DeleteMessage";
import Button from "../../components/Button/Button";
import ConfirmPopUp from "../../components/ConfirmPopUp/ConfirmPopUp";

const OtherProfil = ({ myUserId, admin, setIsLoggedin, setCheckLogin }) => {
  const [infoPseudonyme, setInfoPseudonyme] = useState("");
  const [infoBio, setInfoBio] = useState("");
  const [infoAvatar, setInfoAvatar] = useState("");
  const [messagesOtherUser, setMessagesOtherUser] = useState([]);
  const [openDelete, setOpenDelete] = useState(false);
  const [openAdminOtherUser, setOpenAdminOtherUser] = useState(false);

  const history = useHistory();
  const groupomaniaUser = JSON.parse(sessionStorage.getItem("groupomania-user"));
  useEffect(() => {
    if (history.location?.state?.id) {
      const getInfos = async () => {
        const token = JSON.parse(JSON.stringify(sessionStorage.getItem("groupomania-token")));
        try {
          const response = await api({
            url: history.location.state.id + "/profile/",
            method: "get",
            headers: { Authorization: `Bearer ${token}` },
          });
          setInfoAvatar(response.data.avatar);
          setInfoPseudonyme(response.data.username);
          setInfoBio(response.data.bio);
          try {
            const response = await api({
              url: "/view/" + history.location.state.id + "/messages",
              method: "get",
              headers: { Authorization: `Bearer ${token}` },
            });
            setMessagesOtherUser(response.data);
          } catch (error) {}
        } catch (error) {}
      };
      getInfos();
    } else {
      history.push("/");
    }
  }, [history]);

  const handleDeleteModal = () => {
    setOpenDelete(!openDelete);
  };

  const handleAdminToUserModal = () => {
    setOpenAdminOtherUser(!openAdminOtherUser);
  };

  const onDeleteOtherUser = async () => {
    const token = JSON.parse(JSON.stringify(sessionStorage.getItem("groupomania-token")));

    try {
      await api({
        url: "/user/" + history.location.state.id,
        method: "delete",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "multipart/from-data",
        },
      });
      history.push("/");
    } catch (error) {}
  };

  const changeLike = ({ messageId, like, dislike }) => {
    const displayLike = messagesOtherUser.filter((element) => {
      if (element.id === messageId) {
        element.likes = like;
        element.dislikes = dislike;
      }
      return element;
    });
    setMessagesOtherUser(displayLike);
  };
  const changeComment = ({ messageId, comments }) => {
    const displayComment = messagesOtherUser.filter((element) => {
      if (element.id === messageId) {
        element.comments = comments;
      }
      return element;
    });
    setMessagesOtherUser(displayComment);
  };

  // rendre dynamique la suppression de message
  const changeDeleteMessage = (messageId) => {
    const idToDelete = messageId;
    const displayMessages = messagesOtherUser.filter((element) => element.id !== idToDelete);
    setMessagesOtherUser(displayMessages);
  };

  return (
    <div>
      <div>
        <div>
          Avatar :
          <img className="avatar-picture" src={infoAvatar} />
        </div>
        <div>Pseudonyme : {infoPseudonyme}</div>
        <div>Description : {infoBio}</div>
        {admin === true && (
          <div>
            <div>
              <Button onClick={handleAdminToUserModal} title="Devenir Administateur" />
              <ConfirmPopUp
                open={openAdminOtherUser}
                handleModal={handleAdminToUserModal}
                confirmModalAction
                modalTitle="Donner les pouvoirs administrateur à cet Utilisateur ?"
                buttonTitle1="Confirmer"
                buttonTitle2="Annuler"
              />
            </div>
            <div>
              <Button onClick={handleDeleteModal} title="Supprimer Son Compte" />
              <ConfirmPopUp
                open={openDelete}
                handleModal={handleDeleteModal}
                confirmModalAction={onDeleteOtherUser}
                modalTitle="Supprimer le compte de cet Utilisateur ?"
                buttonTitle1="Confirmer"
                buttonTitle2="Annuler"
              />
            </div>
          </div>
        )}
      </div>
      {messagesOtherUser.map((element) => {
        const messageLikeByCurrentUser = element?.Likes?.filter((elt) => groupomaniaUser.id === elt.userId);
        return (
          <div key={element.id}>
            <div>
              <img className="avatar-picture" src={element.User.avatar} />
              {element.User.username}
            </div>
            <div>{element.createdAt}</div>
            <div>{element.title}</div>
            {element.attachment && (
              <div style={{ width: "50%", height: "20em" }}>
                <img src={element.attachment} alt="img" style={{ width: "50%", height: "20em" }} />
              </div>
            )}
            <div>{element.content}</div>
            <LikeDislikeMessage
              changeLike={changeLike}
              like={element.likes}
              dislike={element.dislikes}
              messageId={element.id}
              messageLikeByCurrentUser={messageLikeByCurrentUser}
            />
            <CommentMessage
              admin={admin}
              setMessagesOtherUser={setMessagesOtherUser}
              changeComment={changeComment}
              comments={element.comments}
              messageId={element.id}
              myUserId={myUserId}
              locationState={"/view/" + history.location.state.id + "/messages"}
            />
            <ModifyMessage
              messagesOtherUser={messagesOtherUser}
              admin={admin}
              messageId={element.id}
              title={element.title}
              attachment={element.attachment}
              content={element.content}
              myUserId={myUserId}
              idUserMessage={element.UserId}
              setMessagesOtherUser={setMessagesOtherUser}
              getMessagesURI={"/view/" + history.location.state.id + "/messages"}
            />
            <DeleteMessage
              admin={admin}
              changeDeleteMessage={changeDeleteMessage}
              messageId={element.id}
              myUserId={myUserId}
              idUserMessage={element.UserId}
            />
          </div>
        );
      })}
    </div>
  );
};
export default OtherProfil;
