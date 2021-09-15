import Input from "../../components/Input/Input";
import InputTextArea from "../../components/Input/InputTextARea";
import Button from "../../components/Button/Button";
import api from "../../Config/Api";
import { useState } from "react";
import { useHistory } from "react-router";
import { toastTrigger } from "../../helper/toast";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import "./register.css";

const Register = ({ /*setIsLoggedin*/ setMyUserId }) => {
  const history = useHistory();
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const onChangeFirstname = (e) => {
    setFirstname(e.target.value);
  };

  const onChangeLastname = (e) => {
    setLastname(e.target.value);
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

  const onChangeConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
  };

  const onRegister = async () => {
    if (password !== confirmPassword) {
      setErrorMessage("vous n'avez pas saisie le même mot de passe");
      return;
    }
    try {
      const response = await api.post("/users/registrer/", {
        firstname,
        lastname,
        bio,
        email,
        password,
        confirmPassword,
      });

      //sessionStorage.setItem("groupomania-token", response.data.token);
      //setIsLoggedin(true);

      setMyUserId(response.data.userId);
      toastTrigger("success", "Inscription réussie");
      //history.push("/accueil");
      history.push("/connexion");
    } catch (error) {
      toastTrigger("error", "Une erreur est survenue ⛔️");
      setErrorMessage(error.response.data.error);
    }
  };

  return (
    <div className="register-container">
      <div className="register-title">Rejoignez vos collaborateurs en vous inscrivant</div>
      <div className="register-input">
        <Input onChange={onChangeEmail} value={email} label="e-mail" />
      </div>
      <div className="register-input">
        <Input onChange={onChangeFirstname} value={firstname} label="Prénom" />
      </div>
      <div className="register-input">
        <Input onChange={onChangeLastname} value={lastname} label="NOM" />
      </div>
      <div className="register-input">
        <Input onChange={onChangePassword} value={password} label="mot de passe" type="password" />
      </div>
      <div className="register-input">
        <Input
          onChange={onChangeConfirmPassword}
          value={confirmPassword}
          label="confirmer mot de passe"
          type="password"
        />
      </div>
      <div className="register-input">
        <InputTextArea rows={4} variant="outlined" label="Description" onChange={onChangeBio} value={bio} />
      </div>
      <div className="register-button">
        <Button onClick={onRegister} title="S'inscrire" />
      </div>
      {errorMessage && <ErrorMessage message={errorMessage} />}
    </div>
  );
};
export default Register;
