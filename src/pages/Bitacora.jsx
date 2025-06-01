import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  Fade,
} from "@mui/material";
import api from "../services/api";
import CustomTable from "../components/CustomTable";
import { useSearchParams } from "react-router-dom";

const columnas = [
  { campo: "FECHA_REGISTRO", label: "Fecha", visible: true },
  { campo: "USUARIO", label: "Usuario", visible: true },
  { campo: "TABLA", label: "Tabla", visible: true },
  { campo: "ACCION", label: "Acción", visible: true },
  { campo: "DATO_ANTERIOR", label: "Previo", visible: true },
  { campo: "DATO_POSTERIOR", label: "Nuevo dato", visible: true },
];

const Bitacora = () => {
  const [searchParams] = useSearchParams();
  const tabla = searchParams.get("tabla");
  const identificador = searchParams.get("identificador");

  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(
        `/ptLogs/buscar/${tabla}/${identificador}`
      );
      const transformed = data.map((log) => ({
        ...log,
        USUARIO: log.USUARIO?.USERNAME || "—",
      }));
      setItems(transformed);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "No se pudieron cargar los registros de logs"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tabla && identificador) {
      fetchLogs();
    }
  }, [tabla, identificador]);

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
        🔍 Historial de Cambios
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : (
        <Fade in>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
            <CustomTable data={items} columns={columnas} />
          </Paper>
        </Fade>
      )}
    </Box>
  );
};

export default Bitacora;
