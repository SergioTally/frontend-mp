import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  MenuItem,
} from "@mui/material";

const FormDialog = ({
  open,
  onClose,
  onSave,
  formData,
  setFormData,
  columnas,
  selectOptions = {},
  isEdit = false,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {isEdit ? "Editar Registro" : "Agregar Registro"}
      </DialogTitle>
      <DialogContent>
        <Grid
          container
          spacing={2}
          sx={{ mt: 1, justifyContent: "space-between" }}
        >
          {columnas
            .filter((col) => col.tipo !== "hidden")
            .map(
              (
                {
                  campo,
                  label,
                  tipo,
                  editable = true,
                  options,
                  optionValue,
                  optionLabel,
                },
                index
              ) => (
                <Grid item sx={{ width: "40%" }} key={`${campo}-${index}`}>
                  {tipo === "select" ? (
                    <TextField
                      select
                      label={label}
                      value={formData[campo] || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          [campo]: e.target.value,
                        }))
                      }
                      fullWidth
                      disabled={isEdit && !editable}
                    >
                      {(selectOptions[options] || []).map((opt) => (
                        <MenuItem
                          key={opt[optionValue]}
                          value={opt[optionValue]}
                        >
                          {typeof optionLabel === "function"
                            ? optionLabel(opt)
                            : opt[optionLabel]}
                        </MenuItem>
                      ))}
                    </TextField>
                  ) : (
                    <TextField
                      label={label}
                      type={
                        tipo === "number"
                          ? "number"
                          : tipo === "date"
                          ? "date"
                          : "text"
                      }
                      value={formData[campo] || ""}
                      disabled={isEdit && !editable}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          [campo]: e.target.value,
                        }))
                      }
                      fullWidth
                      InputLabelProps={
                        tipo === "date" ? { shrink: true } : undefined
                      }
                    />
                  )}
                </Grid>
              )
            )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={onSave}>
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FormDialog;
