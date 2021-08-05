import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import Input from "../../components/Input/Input";
import InputTextArea from "../../components/Input/InputTextARea";
import Button from "../Button/Button";
import "./modif-pop-up.css";

const ModifPopUp = ({
  open,
  handleModal,
  modalTitle,
  buttonTitle1,
  buttonTitle2,

  newTitle,
  newContent,
  newFile,
  setNewFile,
  setNewTitle,
  setNewContent,
  attachment,
  onUpdate,
  setFileToSend,
}) => {
  const onUploadFile = (e) => {
    setNewFile(URL.createObjectURL(e.target.files[0]));

    setFileToSend(e.target.files[0]);
  };

  const onChangeTitle = (e) => {
    setNewTitle(e.target.value);
  };

  const onChangeContent = (e) => {
    setNewContent(e.target.value);
  };

  return (
    <Dialog open={open} onClose={handleModal}>
      <div className="modif-pop-up-container">
        <DialogTitle>{modalTitle}</DialogTitle>
        <Input value={newTitle} onChange={onChangeTitle} label="Titre" type="text" />
        {attachment && (
          <div>
            <img src={newFile} alt="img" style={{ width: "50%", height: "20em" }} />
          </div>
        )}
        <Input onChange={onUploadFile} type="file" />
        <InputTextArea
          value={newContent}
          onChange={onChangeContent}
          id="outlined-multiline-static"
          label="Publication"
          rows={4}
          variant="outlined"
        />
        <Button title={buttonTitle1} onClick={onUpdate} />
        <Button title={buttonTitle2} onClick={handleModal} />
      </div>
    </Dialog>
  );
};
export default ModifPopUp;
