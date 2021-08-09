import logo_1 from "../../assets/logo_1.png";
import Button from "../Button/Button";
import { useState } from "react";
import { useHistory } from "react-router";
import "./header.css";

const Header = ({ isLoggedin, setIsLoggedin }) => {
  const history = useHistory();
  const [isLogPage, setIsLogPage] = useState(false);

  const onLogout = () => {
    setIsLoggedin(false);
    sessionStorage.removeItem("test");
    sessionStorage.removeItem("groupomania-user");
    history.push("/");
  };

  history.listen((location) => {
    setIsLogPage(location.pathname === "/connexion" || location.pathname === "/inscription");
  });

  return (
    <div className="grpm-header">
      <div className="grpm-logo-title">
        <div className="grpm-logo_1">
          <img src={logo_1} onClick={() => history.push("/accueil")} alt="logo groupomania" />
        </div>
        <h1 className="grpm-title">Une nouvelle vision de la grande distribution</h1>
      </div>
      {isLoggedin && (
        <div className="grpm-buttons-log">
          <Button className="button-profil" onClick={() => history.push("/accueil")} title="Accueil" />
          <Button className="button-profil" onClick={() => history.push("/profil")} title="Votre Profil" />
          <Button className="button-logout" title="Déconnexion" onClick={onLogout} />
        </div>
      )}

      {isLogPage && (
        <div className="grpm-button-back">
          <Button onClick={() => history.goBack()} title="Retour" />
        </div>
      )}
    </div>
  );
};

export default Header;
