import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import InputTextArea from "../../components/Input/InputTextARea";
import Button from "../Button/Button";
import Switch from "@material-ui/core/Switch";
import ConfirmPopUp from "../ConfirmPopUp/ConfirmPopUp";
import api from "../../Config/Api";

const ProfilDetails = ({ myUserId, setIsLoggedin, setCheckLogin }) => {
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [pseudonyme, setPseudonyme] = useState("");
  const [isDisable, setIsDisable] = useState(true);
  const [bio, setBio] = useState("");
  const groupomaniaUser = JSON.parse(sessionStorage.getItem("groupomania-user"));

  useEffect(() => {
    if (sessionStorage.getItem("groupomania-user")) {
      setEmail(groupomaniaUser.email);
      setPseudonyme(groupomaniaUser.username);
      setBio(groupomaniaUser.bio);
    } else {
      history.push("/");
    }
  }, [history]);

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

  const onDeleteUser = async () => {
    const token = JSON.parse(JSON.stringify(sessionStorage.getItem("test")));

    try {
      const response = await api({
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
      sessionStorage.removeItem("test");
      sessionStorage.removeItem("groupomania-user");
      history.push("/");
    } catch (error) {}
  };

  return (
    <div>
      <div>
        <FontAwesomeIcon color="green" icon={["fas", "user-circle"]} />
        <div>Mon Profil</div>
      </div>
      <div style={{ padding: "10px", border: "1px solid black" }}>
        <div> e-mail : {email} </div>
        <div> Pseudonyme : {pseudonyme} </div>
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
