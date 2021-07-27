import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import api from "../../Config/Api";
import { useState } from "react";
import { useHistory } from "react-router";

const Login = ({ setIsLoggedin, setMyUserId }) => {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const onChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const onLogin = async () => {
    try {
      const response = await api.post("/users/login/", {
        email,
        password,
      });
      sessionStorage.setItem("test", response.data.token);
      setIsLoggedin(true);
      setMyUserId(response.data.userId);
      history.push("/accueil");
    } catch (error) {}
  };

  return (
    <div>
      Login
      <Input onChange={onChangeEmail} label="e-mail" type="email" />
      <Input onChange={onChangePassword} label="mot de passe" type="password" />
      <Button onClick={onLogin} title="Connexion" />
    </div>
  );
};

export default Login;
