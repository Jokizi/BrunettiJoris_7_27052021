import React from "react";
import TextField from "@material-ui/core/TextField";

const Input = ({ label, type = "text", onChange, value, theInputKey }) => {
  return (
    <TextField
      value={value}
      onChange={onChange}
      label={label}
      variant="outlined"
      type={type}
      autoComplete="off"
      key={theInputKey || ""}
    />
  );
};

export default Input;
