import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  Fade,
  Grid,
  TextField,
  MenuItem,
  Button,
} from "@mui/material";
import SnackbarNotification from "../../components/SnackbarNotification";
import api from "../../services/api";

const ReporteCasos = () => {
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [estado, setEstado] = useState("");
  const [idFiscal, setFiscal] = useState("");
  const [estados, setEstados] = useState([]);
  const [fiscales, setFiscales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const showSnackbar = (message, severity = "success") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const fetchData = async () => {
    try {
      const [resEstados, resFiscales] = await Promise.all([
        api.get("/ptEstadoCaso"),
        api.get("/ptFiscal"),
      ]);
      setEstados(resEstados.data);
      setFiscales(resFiscales.data);
    } catch {
      showSnackbar("Error al cargar los filtros", "error");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const descargarReporte = async () => {
    try {
      setLoading(true);
      const body = {
        fechaInicio,
        fechaFin,
        estado: estado || null,
        idFiscal: idFiscal || null,
      };
      const response = await api.post("/ptCaso/reporte", body, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "reporte_casos.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      showSnackbar(
        err?.response?.data?.message || "Error al generar el reporte",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

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
        📥 Generar Reporte de Casos
      </Typography>

      <Paper
        elevation={3}
        sx={{ p: 4, borderRadius: 4, mb: 4, backgroundColor: "#fafafa" }}
      >
        <Typography variant="h6" color="primary" fontWeight="bold" gutterBottom>
          📊 Filtros para Generar Reporte
        </Typography>
        <Grid container spacing={3} mt={1} justifyContent="space-between">
          <Grid item sx={{ width: "40%" }}>
            <TextField
              label="📅 Fecha Inicio"
              type="date"
              fullWidth
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item sx={{ width: "40%" }}>
            <TextField
              label="📅 Fecha Fin"
              type="date"
              fullWidth
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item sx={{ width: "40%" }}>
            <TextField
              label="📌 Estado del Caso"
              select
              fullWidth
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
            >
              <MenuItem value="">Todos</MenuItem>
              {estados.map((e) => (
                <MenuItem key={e.ID_ESTADO_CASO} value={e.ID_ESTADO_CASO}>
                  {e.NOMBRE}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item sx={{ width: "40%" }}>
            <TextField
              label="🧑‍⚖️ Fiscal"
              select
              fullWidth
              value={idFiscal}
              onChange={(e) => setFiscal(e.target.value)}
            >
              <MenuItem value="">Todos</MenuItem>
              {fiscales.map((f) => (
                <MenuItem key={f.ID_FISCAL} value={f.ID_FISCAL}>
                  {f.PERSONA
                    ? `${f.PERSONA.PRIMER_NOMBRE} ${
                        f.PERSONA.SEGUNDO_NOMBRE ?? ""
                      } ${f.PERSONA.PRIMER_APELLIDO}`.trim()
                    : "Sin nombre"}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={descargarReporte}
            disabled={loading || !fechaInicio || !fechaFin}
          >
            {loading ? <CircularProgress size={24} /> : "📥 Descargar Reporte"}
          </Button>
        </Box>
      </Paper>

      <SnackbarNotification
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />
    </Box>
  );
};

export default ReporteCasos;
