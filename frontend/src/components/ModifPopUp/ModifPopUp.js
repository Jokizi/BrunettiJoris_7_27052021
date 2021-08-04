import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import Input from "../../components/Input/Input";
import InputTextArea from "../../components/Input/InputTextARea";
import Button from "../Button/Button";

const ModifPopUp = ({ open, handleModal, modalTitle, buttonTitle1, buttonTitle2 }) => {
  return (
    <Dialog open={open} onClose={handleModal}>
      <DialogTitle>{modalTitle}</DialogTitle>
      <Input label="Titre" type="text" />
      <Input type="file" />
      <InputTextArea id="outlined-multiline-static" label="Publication" rows={4} variant="outlined" />
      <Button title={buttonTitle1} />
      <Button title={buttonTitle2} onClick={handleModal} />
    </Dialog>
  );
};
export default ModifPopUp;
