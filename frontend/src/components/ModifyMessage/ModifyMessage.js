import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import api from "../../Config/Api";
import { useState } from "react";
import { useEffect } from "react";

const ModifyMessage = ({ myUserId, idUserMessage }) => {
  return (
    <div>
      {myUserId === idUserMessage && (
        <div>
          <FontAwesomeIcon color="green" icon={["far", "edit"]} />
          modifier
        </div>
      )}
    </div>
  );
};
export default ModifyMessage;
