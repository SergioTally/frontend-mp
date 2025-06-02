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
  { campo: "ID_FISCAL", label: "ID", visible: true, tipo: "hidden" },
  {
    campo: "ID_PERSONA",
    label: "Persona",
    visible: false,
    tipo: "select",
    options: "personas",
    optionValue: "ID_PERSONA",
    optionLabel: (item) =>
      `${item.PRIMER_NOMBRE} ${item.SEGUNDO_NOMBRE ?? ""} ${
        item.PRIMER_APELLIDO
      } ${item.SEGUNDO_APELLIDO}`.trim(),
  },
  {
    campo: "ID_FISCALIA",
    label: "Fiscalía",
    visible: false,
    tipo: "select",
    options: "fiscalias",
    optionValue: "ID_FISCALIA",
    optionLabel: "NOMBRE",
  },
  {
    campo: "NOMBRE_FISCAL",
    label: "Nombre del Fiscal",
    visible: true,
    tipo: "hidden",
  },
  {
    campo: "NOMBRE_FISCALIA",
    label: "Nombre de Fiscalía",
    visible: true,
    tipo: "hidden",
  },
  { campo: "ACTIVO", label: "Activo", visible: false, tipo: "hidden" },
  {
    campo: "FECHA_REGISTRO",
    label: "Fecha Registro",
    visible: true,
    tipo: "hidden",
  },
];

const Fiscal = () => {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("NOMBRE_FISCAL");
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
    personas: [],
    fiscalias: [],
  });

  const showSnackbar = (message, severity = "success") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const fetchItems = async () => {
    try {
      const { data } = await api.get("/ptFiscal");
      const transformed = data.map((item) => ({
        ...item,
        NOMBRE_FISCAL: `${item.PERSONA.PRIMER_NOMBRE} ${
          item.PERSONA.SEGUNDO_NOMBRE ?? ""
        } ${item.PERSONA.PRIMER_APELLIDO} ${
          item.PERSONA.SEGUNDO_APELLIDO
        }`.trim(),
        NOMBRE_FISCALIA: item.FISCALIA?.NOMBRE || "",
      }));
      setItems(transformed);
    } catch (err) {
      setError("Error al cargar los fiscales.");
    } finally {
      setLoading(false);
    }
  };

  const fetchSelectOptions = async () => {
    try {
      const [personasRes, fiscaliasRes] = await Promise.all([
        api.get("/ptPersona"),
        api.get("/ptFiscalia"),
      ]);
      setSelectOptions({
        personas: personasRes.data,
        fiscalias: fiscaliasRes.data,
      });
    } catch {
      showSnackbar("Error al cargar personas o fiscalías", "error");
    }
  };

  const handleShow = (item) => {
    setShowData(item);
    setShowOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/ptFiscal/${id}`);
      setItems((prev) => prev.filter((item) => item.ID_FISCAL !== id));
      showSnackbar("Fiscal eliminado correctamente");
    } catch {
      setError("No se pudo eliminar el fiscal.");
      showSnackbar("No se pudo eliminar el fiscal", "error");
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
        handleDelete(selectedItem.ID_FISCAL);
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
        await api.put(`/ptFiscal/${formData.ID_FISCAL}`, formData);
        await fetchItems();
        showSnackbar("Fiscal actualizado correctamente");
      } else {
        const { data } = await api.post("/ptFiscal", formData);
        setItems((prev) => [...prev, data]);
        showSnackbar("Fiscal agregado correctamente");
      }
      setFormOpen(false);
      setFormData({});
      setEditing(false);
    } catch {
      showSnackbar("Error al guardar el fiscal", "error");
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
        🧑‍⚖️ Fiscales del Sistema
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
        Agregar Fiscal
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
              onShow={(item) => handleShow(item)}
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
            ? "Eliminar fiscal"
            : dialogAction === "edit"
            ? "Editar fiscal"
            : "Ver fiscal"
        }
        message={`¿Deseas continuar con la acción de ${dialogAction} para el fiscal?`}
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
    </Box>
  );
};

export default Fiscal;
