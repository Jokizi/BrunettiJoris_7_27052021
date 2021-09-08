import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import InputTextArea from "../../components/Input/InputTextARea";
import Button from "../Button/Button";
import Switch from "@material-ui/core/Switch";
import ConfirmPopUp from "../ConfirmPopUp/ConfirmPopUp";
import api from "../../Config/Api";
import { toastTrigger } from "../../helper/toast";
import Avatar from "../Avatars/Avatars";
import "./profil-details.css";
import ModifCommentPopUp from "../ModifCommentPopUp/ModifCommentPopUP";

const ProfilDetails = ({ myUserId, setIsLoggedin, setCheckLogin }) => {
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [pseudonyme, setPseudonyme] = useState("");
  const [isDisable, setIsDisable] = useState(true);
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");
  const [isAdmin, setIsAdmin] = useState(null);
  const [open, setOpen] = useState(false);
  const [openUsername, setOpenUsername] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const groupomaniaUser = JSON.parse(sessionStorage.getItem("groupomania-user"));

  useEffect(() => {
    if (sessionStorage.getItem("groupomania-user")) {
      setEmail(groupomaniaUser.email);
      setPseudonyme(groupomaniaUser.username);
      setBio(groupomaniaUser.bio);
      setAvatar(groupomaniaUser.avatar);
      setIsAdmin(groupomaniaUser.isAdmin);
    } else {
      history.push("/");
    }
  }, [
    history,
    groupomaniaUser.email,
    groupomaniaUser.username,
    groupomaniaUser.bio,
    groupomaniaUser.avatar,
    groupomaniaUser.isAdmin,
  ]);

  const onChangeAvatar = (newAvatar) => {
    setAvatar(newAvatar);
  };

  const onChangeBio = (e) => {
    setBio(e.target.value);
  };

  const onChangeUsername = (e) => {
    setNewUsername(e.target.value);
  };

  const handleUpdate = () => {
    setIsDisable(!isDisable);
  };

  const handleUpdateModal = () => {
    setOpenUpdate(!openUpdate);
  };

  const handleDeleteModal = () => {
    setOpenDelete(!openDelete);
  };

  const handleModal = () => {
    setOpen(!open);
  };

  const handleUpdateUsername = () => {
    setOpenUsername(!openUsername);
  };

  const onUpdateUsername = async () => {
    const token = JSON.parse(JSON.stringify(sessionStorage.getItem("groupomania-token")));
    if (newUsername === groupomaniaUser.username) {
      toastTrigger("error", "Une erreur est survenue ⛔️");
      setOpenUsername(false);
      return;
    }
    try {
      const response = await api({
        url: "/users/username/",
        method: "put",
        data: { username: newUsername },
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      setOpenUsername(false);

      let oldSessionStorage = groupomaniaUser;
      oldSessionStorage.username = response.data.username;
      sessionStorage.setItem("groupomania-user", JSON.stringify(oldSessionStorage));
      setPseudonyme(response.data.username);
      toastTrigger("success", "Profil Mis à Jour 👌🏼");
    } catch (error) {
      toastTrigger("error", "Une erreur est survenue ⛔️");
    }
  };

  const onUpdateBio = async () => {
    const token = JSON.parse(JSON.stringify(sessionStorage.getItem("groupomania-token")));
    if (bio === groupomaniaUser.bio) {
      toastTrigger("error", "Une erreur est survenue ⛔️");
      setOpenUpdate(false);
      return;
    }
    try {
      const response = await api({
        url: "/users/profile/",
        method: "put",
        data: { bio },
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      let oldSessionStorage = groupomaniaUser;
      oldSessionStorage.bio = response.data.bio;
      sessionStorage.setItem("groupomania-user", JSON.stringify(oldSessionStorage));
      setOpenUpdate(!openUpdate);

      setIsDisable(true);
      toastTrigger("success", "Profil Mis à Jour 👌🏼");
    } catch (error) {
      toastTrigger("error", "Une erreur est survenue ⛔️");
    }
  };

  const onDeleteUser = async () => {
    const token = JSON.parse(JSON.stringify(sessionStorage.getItem("groupomania-token")));

    try {
      await api({
        url: "/user/" + myUserId,
        method: "delete",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "multipart/from-data",
        },
      });
      setCheckLogin(false);
      setIsLoggedin(false);
      sessionStorage.removeItem("groupomania-token");
      sessionStorage.removeItem("groupomania-user");
      history.push("/");
    } catch (error) {}
  };

  return (
    <div>
      <div className="user-profil-big-container">
        <div className="user-profil-title">
          <div>Mon Profil</div>
        </div>
        <div className="user-profil-container">
          <div className="avatar-container">
            <div>Avatar :</div>
            <div className="avatar-picture">
              <img width="100%" height="100%" style={{ borderRadius: "50%" }} src={avatar} />
            </div>
            <div className="user-button-modify-avatar">
              <Button onClick={handleModal} title="Modifier Avatar" />
            </div>
            <Avatar onChangeAvatar={onChangeAvatar} open={open} close={handleModal} />
          </div>

          <div className="user-name-container">
            <div className="user-email"> e-mail : {email} </div>
            <div className="user-name">Pseudonyme : {pseudonyme}</div>
            <div className="message-is-admin">
              {isAdmin && <FontAwesomeIcon color="#fc930c" icon={["fas", "user-cog"]} />} {isAdmin && "Administrateur"}
            </div>
            <div onClick={handleUpdateUsername}>
              <FontAwesomeIcon color="blue" icon={["far", "edit"]} /> modifier pseudonyme
            </div>
            <ModifCommentPopUp
              open={openUsername}
              onChange={onChangeUsername}
              handleModal={handleUpdateUsername}
              onUpdate={onUpdateUsername}
              modalTitle="Modifier votre pseudonyme"
              label="Modifier pseudonyme"
              buttonTitle1="Sauvegarder Modifications"
              buttonTitle2="Annuler Modifications"
            />
          </div>
          <div className="user-description-container">
            <div className="user-description-input">
              <InputTextArea
                disabled={isDisable}
                rows={4}
                variant="outlined"
                label="Description"
                onChange={onChangeBio}
                value={bio}
              />
            </div>
            <div>
              Mettre à jour votre description :
              <div>
                <Switch color="primary" checked={!isDisable} onChange={handleUpdate} name="UpdateBio" />
              </div>
              <div className="button-modify-bio">
                <Button onClick={handleUpdateModal} title="Modifier Ma Description" />
              </div>
            </div>
          </div>

          <div className="button-delete-my-account">
            <Button onClick={handleDeleteModal} title="Supprimer Mon Compte" />
          </div>

          <ConfirmPopUp
            open={openUpdate}
            handleModal={handleUpdateModal}
            modalTitle="Modifier la Description ?"
            buttonTitle1="Sauvegarder Modifications"
            buttonTitle2="Annuler Modifications"
            confirmModalAction={onUpdateBio}
            bio={bio}
            setBio={setBio}
          />

          <ConfirmPopUp
            open={openDelete}
            handleModal={handleDeleteModal}
            confirmModalAction={onDeleteUser}
            modalTitle="Supprimer votre compte ?"
            buttonTitle1="Confirmer"
            buttonTitle2="Annuler"
          />
        </div>
      </div>
    </div>
  );
};
export default ProfilDetails;
