import { Alert, Snackbar } from "@mui/material";

interface SnackNotifProps {
  message: string;
  severity: "success" | "info" | "warning" | "error";
  open: boolean;
  setOpen: (open: boolean) => void;
}
const SnackNotif: React.FC<SnackNotifProps> = ({
  message,
  severity,
  open,
  setOpen,
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={() => setOpen(false)}
    >
      <Alert
        onClose={() => setOpen(false)}
        severity={severity}
        sx={{ width: "100%" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default SnackNotif;
