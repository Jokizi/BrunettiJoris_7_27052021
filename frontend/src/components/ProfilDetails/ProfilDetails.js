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

const ProfilDetails = ({ myUserId, setIsLoggedin, setCheckLogin }) => {
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [pseudonyme, setPseudonyme] = useState("");
  const [isDisable, setIsDisable] = useState(true);
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");
  const [open, setOpen] = useState(false);

  const groupomaniaUser = JSON.parse(sessionStorage.getItem("groupomania-user"));

  useEffect(() => {
    if (sessionStorage.getItem("groupomania-user")) {
      setEmail(groupomaniaUser.email);
      setPseudonyme(groupomaniaUser.username);
      setBio(groupomaniaUser.bio);
      setAvatar(groupomaniaUser.avatar);
    } else {
      history.push("/");
    }
  }, [history, groupomaniaUser.email, groupomaniaUser.username, groupomaniaUser.bio, groupomaniaUser.avatar]);

  const onChangeAvatar = (newAvatar) => {
    setAvatar(newAvatar);
  };

  const onChangeBio = (e) => {
    setBio(e.target.value);
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
      <div>
        <FontAwesomeIcon color="blue" icon={["fas", "user-circle"]} />
        <div>Mon Profil</div>
      </div>
      <div style={{ padding: "10px", border: "1px solid black" }}>
        <div> e-mail : {email} </div>
        <div> Pseudonyme : {pseudonyme} </div>
        <div>
          <div>Avatar :</div>

          <img className="avatar-picture" src={avatar} />
          <Button onClick={handleModal} title="Sélectionner Avatar" />
          <Avatar onChangeAvatar={onChangeAvatar} open={open} close={handleModal} />
        </div>
        <div>
          <InputTextArea
            disabled={isDisable}
            rows={4}
            variant="outlined"
            label="Description"
            onChange={onChangeBio}
            value={bio}
          />
        </div>
        <div>Mettre à jour votre description :</div>
        <div>
          <Switch color="primary" checked={!isDisable} onChange={handleUpdate} name="UpdateBio" />
        </div>
      </div>
      <div>
        <Button onClick={handleUpdateModal} title="Modifier Profil" />
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
  );
};
export default ProfilDetails;
