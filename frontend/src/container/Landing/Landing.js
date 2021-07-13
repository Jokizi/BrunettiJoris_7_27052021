import Button from "../../components/Button/Button";
import React from "react";
import { useHistory } from "react-router";

const Landing = ({ setIsLoggedin }) => {
  const history = useHistory();

  const goRegister = () => {
    history.push("/inscription");
  };

  const goLogin = () => {
    history.push("/connexion");
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div>
        Notre entreprise, spécialisée dans la grande distribution, est en pleine
        expansion. Nous avons actuellement plus de 600 collaborateurs.
        <br />
        Ce site est fait pour vous rassembler!
      </div>
      <Button onClick={goRegister} title="Inscription" />
      <Button onClick={goLogin} title="Connexion" />
    </div>
  );
};
export default Landing;
