import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
  Stack,
  Button,
  Grid,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const CustomTable = ({
  data = [],
  columns = [],
  order,
  orderBy,
  onSort,
  onShow,
  onEdit,
  onDelete,
  extraActions = [],
  tableBitacora,
}) => {
  const navigate = useNavigate();
  const renderCell = (item, col) => {
    const value = item[col.campo];

    if (col.ignorar || !col.visible) return null;

    if (col.campo === "ACTIVO") {
      return (
        <TableCell key={col.campo}>
          <Typography
            color={value ? "success.main" : "text.secondary"}
            fontWeight="medium"
          >
            {value ? "Sí" : "No"}
          </Typography>
        </TableCell>
      );
    }

    if (col.campo === "FECHA_REGISTRO") {
      return (
        <TableCell key={col.campo}>
          {new Date(value).toLocaleDateString("es-GT", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </TableCell>
      );
    }

    return <TableCell key={col.campo}>{value ?? "—"}</TableCell>;
  };

  return (
    <Table>
      <TableHead>
        <TableRow sx={{ backgroundColor: "#e3f2fd" }}>
          {columns
            .filter((c) => c.visible && !c.ignorar)
            .map((col) => (
              <TableCell
                key={col.campo}
                sortDirection={orderBy === col.campo ? order : false}
              >
                <TableSortLabel
                  active={orderBy === col.campo}
                  direction={orderBy === col.campo ? order : "asc"}
                  onClick={() => onSort(col.campo)}
                >
                  <Typography variant="subtitle2" color="primary">
                    {col.label}
                  </Typography>
                </TableSortLabel>
              </TableCell>
            ))}
          <TableCell>
            <Typography variant="subtitle2" color="primary">
              Acciones
            </Typography>
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((item, idx) => (
          <TableRow key={idx} hover>
            {columns.map((col) => renderCell(item, col))}

            <TableCell>
              <Grid container spacing={1}>
                {typeof onShow === "function" && (
                  <Grid item xs={4}>
                    <Button
                      fullWidth
                      size="small"
                      variant="contained"
                      color="info"
                      sx={{
                        minWidth: 80,
                        height: 40,
                        whiteSpace: "normal",
                        wordWrap: "break-word",
                        textAlign: "center",
                        fontSize: "0.75rem",
                      }}
                      onClick={() => onShow(item)}
                    >
                      Ver
                    </Button>
                  </Grid>
                )}
                {typeof onEdit === "function" && (
                  <Grid item xs={4}>
                    <Button
                      fullWidth
                      size="small"
                      variant="contained"
                      color="secondary"
                      sx={{
                        minWidth: 80,
                        height: 40,
                        whiteSpace: "normal",
                        wordWrap: "break-word",
                        textAlign: "center",
                        fontSize: "0.75rem",
                      }}
                      onClick={() => onEdit(item)}
                    >
                      Editar
                    </Button>
                  </Grid>
                )}
                {typeof onDelete === "function" && (
                  <Grid item xs={4}>
                    <Button
                      fullWidth
                      size="small"
                      variant="contained"
                      color="error"
                      sx={{
                        minWidth: 80,
                        height: 40,
                        whiteSpace: "normal",
                        wordWrap: "break-word",
                        textAlign: "center",
                        fontSize: "0.75rem",
                      }}
                      onClick={() => onDelete(item.ID_USUARIO || item.ID_CASO)}
                    >
                      Eliminar
                    </Button>
                  </Grid>
                )}
                {typeof tableBitacora && (
                  <Grid item xs={4}>
                    <Button
                      fullWidth
                      size="small"
                      variant="outlined"
                      color="primary"
                      sx={{
                        minWidth: 80,
                        height: 40,
                        whiteSpace: "normal",
                        wordWrap: "break-word",
                        textAlign: "center",
                        fontSize: "0.75rem",
                      }}
                      onClick={() => {
                        const tabla = columns.find(
                          (c) => c.tipo === "hidden"
                        )?.campo;
                        const id = item[tabla];
                        navigate(
                          `/Bitacora?tabla=${tableBitacora}&identificador=${id}`
                        );
                      }}
                    >
                      Bitácora
                    </Button>
                  </Grid>
                )}
                {extraActions.map((actionFn, i) => (
                  <Grid item xs={4} key={i}>
                    {React.cloneElement(actionFn(item), {
                      fullWidth: true,
                      size: "small",
                      sx: {
                        minWidth: 160,
                        height: 40,
                        whiteSpace: "normal",
                        wordWrap: "break-word",
                        textAlign: "center",
                        fontSize: "0.75rem",
                        ...actionFn(item).props.sx,
                      },
                    })}
                  </Grid>
                ))}
              </Grid>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default CustomTable;
