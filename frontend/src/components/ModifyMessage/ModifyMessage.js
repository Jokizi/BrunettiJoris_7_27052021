import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import api from "../../Config/Api";
import { useState } from "react";
import { useEffect } from "react";

const ModifyMessage = () => {
  return (
    <div>
      <FontAwesomeIcon color="green" icon={["far", "edit"]} />
      modifier
    </div>
  );
};
export default ModifyMessage;
