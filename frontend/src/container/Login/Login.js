import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import api from "../../Config/Api";
import { useState } from "react";
import { useHistory } from "react-router";
import { toastTrigger } from "../../helper/toast";

const Login = ({ setIsLoggedin, setMyUserId /*setAdmin*/ }) => {
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
    let token;
    try {
      const response = await api.post("/users/login/", {
        email,
        password,
      });
      token = response.data.token;
      sessionStorage.setItem("groupomania-token", response.data.token);
      setIsLoggedin(true);
      setMyUserId(response.data.userId);
      toastTrigger("success", `Bonjour ${response.data.username} ✌🏼`);
      history.push({ pathname: "/accueil" });

      /*try {
        const response = await api({
          url: "/users/profile/",
          method: "get",
          headers: { Authorization: `Bearer ${token}` },
        });
        setAdmin(response.data.isAdmin);
        console.log("------------LOGIN------------------------");
        console.log(response.data);
        console.log("------------------------------------");
      } catch (error) {}*/
    } catch (error) {
      toastTrigger("error", "Une erreur est survenue ⛔️");
    }
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
