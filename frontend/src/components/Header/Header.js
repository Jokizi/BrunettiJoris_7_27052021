import logo_1 from "../../assets/logo_1.png";
import Button from "../Button/Button";
import { useState } from "react";
import { useHistory } from "react-router";
import "./header.css";

const Header = ({ isLoggedin, setIsLoggedin }) => {
  const history = useHistory();

  const onLogout = () => {
    setIsLoggedin(false);
    sessionStorage.removeItem("test");
    sessionStorage.removeItem("groupomania-user");
    history.push("/");
  };

  const onProfil = () => {};
  return (
    <div className="grpm-header">
      <div className="grpm-logo-title">
        <div className="grpm-logo_1">
          <img src={logo_1} alt="logo groupomania" />
        </div>
        <h1 className="grpm-title">Une nouvelle vision de la grande distribution</h1>
      </div>
      {isLoggedin ? (
        <div className="grpm-buttons-log">
          <Button className="button-profil" title="Profil" />
          <Button className="button-logout" title="Déconnexion" onClick={onLogout} />
        </div>
      ) : (
        <div className="grpm-button-accueil">
          <Button onClick={() => history.push("/")} title="Accueil" />
        </div>
      )}
    </div>
  );
};

export default Header;
