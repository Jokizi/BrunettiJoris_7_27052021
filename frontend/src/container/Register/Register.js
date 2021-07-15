import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import api from "../../Config/Api";
import { useState } from "react";
import { useHistory } from "react-router";

const Register = ({ setIsLoggedin }) => {
  const history = useHistory();
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onChangeUsername = (e) => {
    setUsername(e.target.value);
  };

  const onChangeBio = (e) => {
    setBio(e.target.value);
  };

  const onChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const onChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const onRegister = async () => {
    try {
      const response = await api.post("/users/registrer/", {
        username,
        bio,
        email,
        password,
      });

      sessionStorage.setItem("test", response.data.token);
      setIsLoggedin(true);
      history.push("/accueil");
    } catch (error) {}
  };

  return (
    <div>
      Register
      <Input onChange={onChangeEmail} value={email} label="e-mail" />
      <Input onChange={onChangeUsername} value={username} label="Pseudonyme" />
      <Input onChange={onChangePassword} value={password} label="mot de passe" type="password" />
      <Input onChange={onChangeBio} value={bio} label="bio" />
      <Button onClick={onRegister} title="S'inscrire" />
    </div>
  );
};
export default Register;
