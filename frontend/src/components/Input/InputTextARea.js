import React from "react";

import TextField from "@material-ui/core/TextField";

const TextArea = ({ rows, rowsMax, placeholder, onChange, value, id, label, variant, multilinerows }) => {
  return (
    <TextField
      multiline
      onChange={onChange}
      value={value}
      rows={rows}
      multilinerows={multilinerows}
      rowsMax={rowsMax}
      placeholder={placeholder}
      id={id}
      label={label}
      variant={variant}
      autoComplete="off"
    />
  );
};
export default TextArea;