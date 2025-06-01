import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography,
  Box,
  Paper,
} from "@mui/material";
import dayjs from "dayjs";
import "dayjs/locale/es";

dayjs.locale("es");

const ShowDialog = ({ open, onClose, data, columnas }) => {
  if (!data) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontWeight: "bold", color: "primary.main" }}>
        📄 Detalles del Registro
      </DialogTitle>
      <DialogContent>
        <Grid
          container
          spacing={2}
          sx={{ mt: 1, justifyContent: "flex-start" }}
        >
          {columnas
            .filter((col) => !(col.visible === false && col.tipo === "hidden"))
            .map(({ campo, label, tipo }, index) => (
              <Grid item sx={{ width: "49%" }} key={`${campo}-${index}`}>
                <Paper
                  elevation={2}
                  sx={{ p: 2, borderRadius: 2, backgroundColor: "#f0f4f8" }}
                >
                  <Typography
                    variant="subtitle2"
                    color="primary"
                    sx={{ mb: 0.5 }}
                  >
                    {label}
                  </Typography>
                  <Typography variant="body1" color="textPrimary">
                    {tipo === "date" && data[campo]
                      ? dayjs(data[campo]).format("DD/MM/YYYY")
                      : data[campo]?.toString() || "-"}
                  </Typography>
                </Paper>
              </Grid>
            ))}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ShowDialog;
