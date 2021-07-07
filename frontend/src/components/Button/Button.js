const Button = ({ title, onClick }) => {
  return (
    <div
      style={{ padding: "10px", border: "1px solid black" }}
      onClick={onClick}
    >
      {title}
    </div>
  );
};

export default Button;
