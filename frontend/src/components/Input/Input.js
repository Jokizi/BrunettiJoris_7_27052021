import React from "react";
import TextField from "@material-ui/core/TextField";
import { withStyles } from "@material-ui/core/styles";

const CssTextField = withStyles({
  root: {
    "& label.Mui-focused": {
      color: "black",
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "#fc930c",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#fc930c",
      },
      "&:hover fieldset": {
        borderColor: "#fc930c",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#fc930c",
      },
    },
  },
})(TextField);

const Input = ({ label, type = "text", onChange, value, theInputKey }) => {
  return (
    <CssTextField
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
