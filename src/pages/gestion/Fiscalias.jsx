import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  Fade,
  Button,
} from "@mui/material";
import api from "../../services/api";
import CustomTable from "../../components/CustomTable";
import ConfirmDialog from "../../components/ConfirmDialog";
import SnackbarNotification from "../../components/SnackbarNotification";
import FormDialog from "../../components/FormDialog";
import ShowDialog from "../../components/ShowDialog";

const columnas = [
  { campo: "ID_FISCALIA", label: "ID", visible: true, tipo: "hidden" },
  {
    campo: "NOMBRE",
    label: "Nombre",
    visible: true,
    tipo: "text",
    editable: true,
  },
  {
    campo: "DIRECCION",
    label: "Dirección",
    visible: true,
    tipo: "text",
    editable: true,
  },
  {
    campo: "NUMERO",
    label: "Teléfono",
    visible: true,
    tipo: "text",
    editable: true,
  },
  { campo: "ACTIVO", label: "Activo", visible: false, tipo: "hidden" },
  {
    campo: "FECHA_REGISTRO",
    label: "Fecha Registro",
    visible: true,
    tipo: "hidden",
  },
  {
    campo: "FECHA_ELIMINO",
    label: "Fecha Eliminación",
    visible: false,
    tipo: "hidden",
  },
];

const Fiscalias = () => {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("NOMBRE");
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

  const showSnackbar = (message, severity = "success") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const fetchItems = async () => {
    try {
      const { data } = await api.get("/ptFiscalia");
      setItems(data);
    } catch (err) {
      setError("Error al cargar la lista de fiscalías.");
    } finally {
      setLoading(false);
    }
  };

  const handleShow = (item) => {
    setShowData(item);
    setShowOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/ptFiscalia/${id}`);
      setItems((prev) => prev.filter((item) => item.ID_FISCALIA !== id));
      showSnackbar("Fiscalía eliminada correctamente");
    } catch {
      setError("No se pudo eliminar la fiscalía.");
      showSnackbar("No se pudo eliminar la fiscalía", "error");
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
    switch (dialogAction) {
      case "delete":
        handleDelete(selectedItem.ID_FISCALIA);
        break;
      case "edit":
        handleUpdate(selectedItem);
        break;
      default:
        break;
    }
    setDialogOpen(false);
  };

  const handleAdd = async () => {
    try {
      if (editing) {
        await api.put(`/ptFiscalia/${formData.ID_FISCALIA}`, formData);
        await fetchItems();
        showSnackbar("Fiscalía actualizada correctamente");
      } else {
        const { data } = await api.post("/ptFiscalia", formData);
        setItems((prev) => [...prev, data]);
        showSnackbar("Fiscalía agregada correctamente");
      }
      setFormOpen(false);
      setFormData({});
      setEditing(false);
    } catch {
      showSnackbar("Error al guardar la fiscalía", "error");
    }
  };

  useEffect(() => {
    fetchItems();
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
        🏢 Fiscalías del Sistema
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
        Agregar Fiscalía
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
              onSort={handleSort}
              onShow={handleShow}
              onEdit={(item) => confirmAction("edit", item)}
              onDelete={(item) => confirmAction("delete", item)}
            />
          </Paper>
        </Fade>
      )}

      <ConfirmDialog
        open={dialogOpen}
        title={
          dialogAction === "delete"
            ? "Eliminar fiscalía"
            : dialogAction === "edit"
            ? "Editar fiscalía"
            : "Ver fiscalía"
        }
        message={`¿Deseas continuar con la acción de ${dialogAction} para la fiscalía "${selectedItem?.NOMBRE}"?`}
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
        selectOptions={{}}
        isEdit={isEdit}
      />

      <ShowDialog
        open={showOpen}
        onClose={() => setShowOpen(false)}
        data={showData}
        columnas={columnas}
      />
    </Box>
  );
};

export default Fiscalias;
