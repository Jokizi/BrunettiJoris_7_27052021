import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import Input from "../../components/Input/Input";
import Button from "../Button/Button";

const ModifCommentPopUp = ({
  open,
  handleModal,
  modalTitle,
  buttonTitle1,
  buttonTitle2,
  newContent,
  onChange,
  onUpdate,
  label,
}) => {
  return (
    <Dialog open={open} onClose={handleModal}>
      <div>
        <DialogTitle>{modalTitle}</DialogTitle>
        <Input value={newContent} onChange={onChange} label={label} type="text" />
        <Button title={buttonTitle1} onClick={onUpdate} />
        <Button title={buttonTitle2} onClick={handleModal} />
      </div>
    </Dialog>
  );
};
export default ModifCommentPopUp;
