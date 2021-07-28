import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "../Button/Button";

const ConfirmPopUp = ({ open, confirmModalAction, handleModal, buttonTitle1, buttonTitle2, modalTitle }) => {
  return (
    <Dialog open={open} onClose={handleModal}>
      <DialogTitle id="simple-dialog-title">{modalTitle}</DialogTitle>
      <Button title={buttonTitle1} onClick={confirmModalAction} />
      <Button title={buttonTitle2} onClick={handleModal} />
    </Dialog>
  );
};
export default ConfirmPopUp;
