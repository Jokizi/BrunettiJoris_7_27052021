const Button = ({ title, onClick, children }) => {
  return (
    <div style={{ padding: "10px", border: "1px solid black" }} onClick={onClick}>
      <div>{children}</div>
      {title}
    </div>
  );
};

export default Button;
