import logo_1 from "../../assets/logo_1.png";
import Button from "../Button/Button";
import { useState } from "react";
import { useHistory } from "react-router";
import "./header.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Header = ({ isLoggedin, setIsLoggedin }) => {
  const history = useHistory();
  const [isLogPage, setIsLogPage] = useState(false);

  const onLogout = () => {
    setIsLoggedin(false);
    sessionStorage.removeItem("groupomania-token");
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
          <img className="img-logo-1" src={logo_1} onClick={() => history.push("/accueil")} alt="logo groupomania" />
        </div>
        <h1 className="grpm-title">Une nouvelle vision de la grande distribution</h1>
      </div>
      {isLoggedin && (
        <div className="grpm-buttons-log">
          <Button className="button-profil" onClick={() => history.push("/accueil")} title="Accueil">
            <FontAwesomeIcon color="green" icon={["fas", "home"]} />
          </Button>
          <Button className="button-profil" onClick={() => history.push("/profil")} title="Votre Profil">
            <FontAwesomeIcon color="blue" icon={["fas", "user-circle"]} />
          </Button>
          <Button className="button-logout" title="Déconnexion" onClick={onLogout}>
            <FontAwesomeIcon color="red" icon={["fas", "stop-circle"]} />
          </Button>
        </div>
      )}

      {isLogPage && (
        <div className="grpm-button-back">
          <Button onClick={() => history.goBack()} title="Retour">
            <FontAwesomeIcon color="black" icon={["fas", "arrow-alt-circle-left"]} />
          </Button>
        </div>
      )}
    </div>
  );
};

export default Header;
