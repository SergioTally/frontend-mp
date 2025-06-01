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
} from "@mui/material";

const CustomTable = ({
  data = [],
  columns = [],
  order,
  orderBy,
  onSort,
  onShow,
  onEdit,
  onDelete,
}) => {
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
              <Stack direction="row" spacing={1}>
                {typeof onShow === "function" && (
                  <Button
                    size="small"
                    variant="contained"
                    color="info"
                    onClick={() => onShow(item)}
                  >
                    Ver
                  </Button>
                )}
                {typeof onEdit === "function" && (
                  <Button
                    size="small"
                    variant="contained"
                    color="secondary"
                    onClick={() => onEdit(item)}
                  >
                    Editar
                  </Button>
                )}
                {typeof onDelete === "function" && (
                  <Button
                    size="small"
                    variant="contained"
                    color="error"
                    onClick={() => onDelete(item.ID_USUARIO)}
                  >
                    Eliminar
                  </Button>
                )}
              </Stack>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default CustomTable;
