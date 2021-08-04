import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import api from "../../Config/Api";
import { useState } from "react";
import ModifPopUp from "../ModifPopUp/ModifPopUp";

const ModifyMessage = ({ myUserId, idUserMessage }) => {
  const [open, setOpen] = useState(false);

  const handleModal = () => {
    setOpen(!open);
  };
  return (
    <div>
      {myUserId === idUserMessage && (
        <div>
          <FontAwesomeIcon onClick={handleModal} color="green" icon={["far", "edit"]} />
          modifier
        </div>
      )}
      <ModifPopUp
        open={open}
        handleModal={handleModal}
        modalTitle="Modifier la publication"
        buttonTitle1="Sauvegarder Modifications"
        buttonTitle2="Annuler Modifications"
      />
    </div>
  );
};
export default ModifyMessage;
