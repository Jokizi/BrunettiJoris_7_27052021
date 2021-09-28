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
      <div className="grpm-logo_1">
        <img className="img-logo-1" src={logo_1} onClick={() => history.push("/accueil")} alt="logo groupomania" />
      </div>

      {isLoggedin && (
        <div className="grpm-buttons-log-1">
          <div className="grpm-buttons-log-2">
            <Button style={{ marginRight: "20px" }} onClick={() => history.push("/accueil")} title="Accueil">
              <FontAwesomeIcon color="black" icon={["fas", "home"]} />
            </Button>
            <Button style={{ marginRight: "20px" }} onClick={() => history.push("/profil")} title="Profil">
              <FontAwesomeIcon color="black" icon={["fas", "user-circle"]} />
            </Button>
            <Button style={{ marginRight: "20px" }} title="Déconnexion" onClick={onLogout}>
              <FontAwesomeIcon color="black" icon={["fas", "stop-circle"]} />
            </Button>
          </div>
          <div className="grpm-buttons-log-3">
            <Button style={{ marginRight: "20px" }} onClick={() => history.push("/accueil")}>
              <FontAwesomeIcon color="black" icon={["fas", "home"]} />
            </Button>
            <Button style={{ marginRight: "20px" }} onClick={() => history.push("/profil")}>
              <FontAwesomeIcon color="black" icon={["fas", "user-circle"]} />
            </Button>
            <Button style={{ marginRight: "20px" }} onClick={onLogout}>
              <FontAwesomeIcon color="black" icon={["fas", "stop-circle"]} />
            </Button>
          </div>
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
