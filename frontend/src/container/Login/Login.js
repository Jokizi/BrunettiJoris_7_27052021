import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";

const Login = () => {
  return (
    <div>
      Login
      <Input label="e-mail" type="email" />
      <Input label="mot de passe" type="password" />
      <Button title="Connexion" />
    </div>
  );
};

export default Login;
