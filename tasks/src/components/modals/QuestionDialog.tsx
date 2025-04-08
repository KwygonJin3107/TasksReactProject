import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";

type Props = {
  question: string;
  onOk: () => void;
  onClose: () => void;
};

export default function QuestionDialog(props: Props) {
  const { question, onOk, onClose } = props;

  const handleOk = () => {
    onOk();
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <div>
      <Dialog
        open
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{question}</DialogTitle>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleOk} autoFocus>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
