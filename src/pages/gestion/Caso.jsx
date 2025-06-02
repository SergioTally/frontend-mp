import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  Fade,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  TextField,
} from "@mui/material";
import api from "../../services/api";
import CustomTable from "../../components/CustomTable";
import ConfirmDialog from "../../components/ConfirmDialog";
import SnackbarNotification from "../../components/SnackbarNotification";
import FormDialog from "../../components/FormDialog";
import ShowDialog from "../../components/ShowDialog";

const columnas = [
  { campo: "ID_CASO", label: "ID", visible: true, tipo: "hidden" },
  { campo: "CORRELATIVO", label: "Correlativo", visible: true, tipo: "text" },
  { campo: "NOMBRE", label: "Nombre del Caso", visible: true, tipo: "text" },
  { campo: "OBSERVACION", label: "Observación", visible: true, tipo: "text" },
  {
    campo: "ID_FISCAL",
    label: "Fiscal",
    visible: false,
    tipo: "select",
    editable: false,
    options: "fiscales",
    optionValue: "ID_FISCAL",
    optionLabel: (item) =>
      item.PERSONA
        ? `${item.PERSONA.PRIMER_NOMBRE} ${item.PERSONA.SEGUNDO_NOMBRE ?? ""} ${
            item.PERSONA.PRIMER_APELLIDO
          } ${item.PERSONA.SEGUNDO_APELLIDO}`.trim()
        : "",
  },
  {
    campo: "ID_ESTADO_CASO",
    label: "Estado del Caso",
    visible: false,
    tipo: "select",
    options: "estados",
    editable: false,
    optionValue: "ID_ESTADO_CASO",
    optionLabel: "NOMBRE",
  },
  {
    campo: "ID_TIPO_CASO",
    label: "Tipo de Caso",
    visible: false,
    tipo: "select",
    options: "tipos",
    editable: true,
    optionValue: "ID_TIPO_CASO",
    optionLabel: "NOMBRE",
  },
  { campo: "NOMBRE_FISCAL", label: "Fiscal", visible: true, tipo: "hidden" },
  {
    campo: "NOMBRE_FISCALIA",
    label: "Fiscalía",
    visible: true,
    tipo: "hidden",
  },
  { campo: "ESTADO_CASO", label: "Estado", visible: true, tipo: "hidden" },
  { campo: "TIPO_CASO", label: "Tipo de Caso", visible: true, tipo: "hidden" },
  { campo: "ACTIVO", label: "Activo", visible: false, tipo: "hidden" },
  {
    campo: "FECHA_REGISTRO",
    label: "Fecha Registro",
    visible: true,
    tipo: "hidden",
  },
];

const Caso = () => {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("CORRELATIVO");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [isEdit, setIsEdit] = useState(false);
  const [showOpen, setShowOpen] = useState(false);
  const [showData, setShowData] = useState(null);
  const [selectOptions, setSelectOptions] = useState({
    fiscales: [],
    fiscalias: [],
    estados: [],
    tipos: [],
  });
  const [assignOpen, setAssignOpen] = useState(false);
  const [newFiscal, setNewFiscal] = useState("");
  const [confirmStateOpen, setConfirmStateOpen] = useState(false);

  const showSnackbar = (message, severity = "success") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const fetchItems = async () => {
    try {
      const { data } = await api.get("/ptCaso");
      const transformed = data.map((item) => ({
        ...item,
        NOMBRE_FISCAL: item.FISCAL?.PERSONA
          ? `${item.FISCAL.PERSONA.PRIMER_NOMBRE} ${
              item.FISCAL.PERSONA.SEGUNDO_NOMBRE ?? ""
            } ${item.FISCAL.PERSONA.PRIMER_APELLIDO} ${
              item.FISCAL.PERSONA.SEGUNDO_APELLIDO
            }`.trim()
          : "",
        NOMBRE_FISCALIA: item.FISCAL?.FISCALIA?.NOMBRE || "",
        ESTADO_CASO: item.ESTADO_CASO?.NOMBRE || "",
        TIPO_CASO: item.TIPO_CASO?.NOMBRE || "",
      }));
      setItems(transformed);
    } catch (err) {
      setError("Error al cargar los casos.");
    } finally {
      setLoading(false);
    }
  };

  const fetchSelectOptions = async () => {
    try {
      const [fiscales, fiscalias, estados, tipos] = await Promise.all([
        api.get("/ptFiscal"),
        api.get("/ptFiscalia"),
        api.get("/ptEstadoCaso"),
        api.get("/ptTipoCaso"),
      ]);
      setSelectOptions({
        fiscales: fiscales.data,
        fiscalias: fiscalias.data,
        estados: estados.data,
        tipos: tipos.data,
      });
    } catch (error) {
      showSnackbar("Error al cargar datos del formulario", "error");
    }
  };

  const handleShow = (item) => {
    setShowData(item);
    setShowOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/ptCaso/${id}`);
      await fetchItems();
      showSnackbar("Caso eliminado correctamente");
    } catch {
      setError("No se pudo eliminar el caso.");
      showSnackbar("No se pudo eliminar el caso", "error");
    }
  };

  const handleUpdate = (item) => {
    setFormData(item);
    setFormOpen(true);
    setIsEdit(true);
    setEditing(true);
  };

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortComparator = (a, b, orderBy) => {
    const aVal = a[orderBy] ?? "";
    const bVal = b[orderBy] ?? "";
    return typeof aVal === "number" && typeof bVal === "number"
      ? aVal - bVal
      : aVal.toString().localeCompare(bVal.toString());
  };

  const sortedItems = [...items].sort((a, b) =>
    order === "asc"
      ? sortComparator(a, b, orderBy)
      : -sortComparator(a, b, orderBy)
  );

  const confirmAction = (type, item) => {
    setSelectedItem(item);
    setDialogAction(type);
    setDialogOpen(true);
  };

  const handleDialogConfirm = () => {
    if (dialogAction === "delete") handleDelete(selectedItem.ID_CASO);
    else if (dialogAction === "edit") handleUpdate(selectedItem);
    setDialogOpen(false);
  };

  const handleAdd = async () => {
    try {
      if (editing) {
        await api.put(`/ptCaso/${formData.ID_CASO}`, formData);
        await fetchItems();
        showSnackbar("Caso actualizado correctamente");
      } else {
        await api.post("/ptCaso", formData);
        await fetchItems();
        showSnackbar("Caso agregado correctamente");
      }
      setFormOpen(false);
      setFormData({});
      setEditing(false);
    } catch {
      showSnackbar("Error al guardar el caso", "error");
    }
  };

  const asignarFiscal = async () => {
    try {
      await api.post("/ptCaso/asignarfiscal", {
        ID_CASO: selectedItem.ID_CASO,
        ID_FISCAL: newFiscal,
      });
      await fetchItems();
      showSnackbar("Fiscal asignado correctamente");
      setAssignOpen(false);
      setNewFiscal("");
    } catch (err) {
      const msg = err?.response?.data?.message || "Error al asignar fiscal";
      showSnackbar(msg, "error");
    }
  };

  const descargarPDF = async (id) => {
    try {
      const response = await api.get(`/ptCaso/${id}/informe-pdf`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `informe_caso_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      showSnackbar("Error al descargar el informe PDF", "error");
    }
  };

  const modificarEstado = async () => {
    try {
      const estados = selectOptions.estados.sort(
        (a, b) => a.ID_ESTADO_CASO - b.ID_ESTADO_CASO
      );
      const actual = estados.findIndex(
        (e) => e.ID_ESTADO_CASO === selectedItem.ID_ESTADO_CASO
      );
      const siguiente = estados[actual + 1];
      if (!siguiente) return;

      await api.post("/ptCaso/modificarestado", {
        ID_CASO: selectedItem.ID_CASO,
        ID_ESTADO_CASO: siguiente.ID_ESTADO_CASO,
      });
      await fetchItems();
      showSnackbar("Estado del caso actualizado");
      setConfirmStateOpen(false);
    } catch {
      showSnackbar("Error al modificar el estado", "error");
    }
  };

  useEffect(() => {
    fetchItems();
    fetchSelectOptions();
  }, []);

  return (
    <Box
      sx={{
        px: 4,
        pt: 4,
        pb: 6,
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Typography variant="h4" fontWeight="bold" mb={4} color="primary">
        📂 Casos Registrados
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Button
        variant="contained"
        color="primary"
        sx={{ mb: 3 }}
        onClick={() => {
          setFormOpen(true);
          setIsEdit(false);
        }}
      >
        Agregar Caso
      </Button>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : (
        <Fade in>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
            <CustomTable
              data={sortedItems}
              columns={columnas}
              order={order}
              orderBy={orderBy}
              tableBitacora={"PT_CASO"}
              onSort={handleSort}
              onShow={(item) => handleShow(item)}
              onEdit={(item) => confirmAction("edit", item)}
              onDelete={(item) => confirmAction("delete", item)}
              extraActions={[
                (item) => (
                  <Button
                    key="asignar"
                    size="small"
                    variant="outlined"
                    color="primary"
                    onClick={() => {
                      setSelectedItem(item);
                      setAssignOpen(true);
                    }}
                  >
                    Asignar Fiscal
                  </Button>
                ),
                (item) => (
                  <Button
                    key="estado"
                    size="small"
                    variant="outlined"
                    color="warning"
                    onClick={() => {
                      setSelectedItem(item);
                      setConfirmStateOpen(true);
                    }}
                    disabled={
                      item.ID_ESTADO_CASO ===
                      Math.max(
                        ...selectOptions.estados.map((e) => e.ID_ESTADO_CASO)
                      )
                    }
                  >
                    Modificar Estado
                  </Button>
                ),
                (item) => (
                  <Button
                    key="pdf"
                    size="small"
                    variant="outlined"
                    color="success"
                    onClick={() => descargarPDF(item.ID_CASO)}
                  >
                    Descargar Informe
                  </Button>
                ),
              ]}
            />
          </Paper>
        </Fade>
      )}

      <ConfirmDialog
        open={dialogOpen}
        title={
          dialogAction === "delete"
            ? "Eliminar caso"
            : dialogAction === "edit"
            ? "Editar caso"
            : "Ver caso"
        }
        message={`¿Deseas continuar con la acción de ${dialogAction} para el caso?`}
        onConfirm={handleDialogConfirm}
        onCancel={() => setDialogOpen(false)}
      />

      <SnackbarNotification
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />

      <FormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={handleAdd}
        formData={formData}
        setFormData={setFormData}
        columnas={columnas}
        selectOptions={selectOptions}
        isEdit={isEdit}
      />

      <ShowDialog
        open={showOpen}
        onClose={() => setShowOpen(false)}
        data={showData}
        columnas={columnas}
      />

      <Dialog
        open={assignOpen}
        onClose={() => setAssignOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: "bold", color: "primary.main" }}>
          Asignar Fiscal
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            select
            fullWidth
            label="Selecciona un Fiscal"
            value={newFiscal}
            onChange={(e) => setNewFiscal(e.target.value)}
            sx={{ mt: 2 }}
          >
            {selectOptions.fiscales.map((f) => (
              <MenuItem key={f.ID_FISCAL} value={f.ID_FISCAL}>
                {f.PERSONA
                  ? `${f.PERSONA.PRIMER_NOMBRE} ${
                      f.PERSONA.SEGUNDO_NOMBRE ?? ""
                    } ${f.PERSONA.PRIMER_APELLIDO} ${
                      f.PERSONA.SEGUNDO_APELLIDO
                    }`.trim()
                  : "Sin Nombre"}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setAssignOpen(false)}>Cancelar</Button>
          <Button onClick={asignarFiscal} variant="contained">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={confirmStateOpen}
        onClose={() => setConfirmStateOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: "bold", color: "primary.main" }}>
          Modificar Estado
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography variant="body1">
            ¿Estás seguro de que este caso ha completado su etapa actual y
            deseas avanzar al siguiente estado?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setConfirmStateOpen(false)}>Cancelar</Button>
          <Button onClick={modificarEstado} variant="contained" color="warning">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Caso;
