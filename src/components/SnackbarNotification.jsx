import React from "react";
import { Snackbar, Alert } from "@mui/material";

const SnackbarNotification = ({
  open,
  onClose,
  message,
  severity = "success",
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert onClose={onClose} severity={severity} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default SnackbarNotification;
