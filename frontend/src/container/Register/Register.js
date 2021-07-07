import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";

const Register = () => {
  return (
    <div>
      Register
      <Input label="Prénom" />
      <Input label="Nom" />
      <Input label="e-mail" type="email" />
      <Input label="mot de passe" type="password" />
      <Button title="S'inscrire" />
    </div>
  );
};
export default Register;
