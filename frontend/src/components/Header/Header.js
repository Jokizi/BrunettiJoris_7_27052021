import logo_1 from "../../assets/logo_1.png";
import Button from "../Button/Button";

const Header = () => {
  return (
    <div className="grpm-header">
      <img src={logo_1} alt="logo groupomania" className="grpm-logo_1" />
      <h1 className="grpm-title">
        Groupomania pour une nouvelle vision de la grande distribution
      </h1>
      <Button title="hello" />

      <Button title="zertyu" />
    </div>
  );
};

export default Header;
