import {
  Dashboard as DashboardIcon,
  Gavel,
  People,
  AdminPanelSettings,
  AccountBox,
  LibraryBooks,
  Person,
  AssignmentInd,
  ListAlt,
  Business,
} from "@mui/icons-material";

import Dashboard from "../pages/reporteria/Dashboard";
import ReporteCasos from "../pages/reporteria/ReporteCasos";
import PT_CASO from "../pages/gestion/Caso";
import PT_ESTADO_CASO from "../pages/gestion/EstadoCaso";
import PT_TIPO_CASO from "../pages/gestion/TipoCaso";
import PT_FISCAL from "../pages/gestion/Fiscal";
import PT_FISCALIA from "../pages/gestion/Fiscalias";
import PT_USUARIO from "../pages/catalogo/Usuarios";
import PT_ROLE from "../pages/catalogo/Roles";
import PT_PERMISO from "../pages/catalogo/Permisos";
import PT_PERSONA from "../pages/catalogo/Personas";
import PT_LOGS from "../pages/Items";
import Bitacora from "../pages/Bitacora";

export const groupedMenu = {
  Dashboard: [
    {
      label: "Inicio",
      icon: <DashboardIcon />,
      path: "/",
      component: Dashboard,
      roles: ["ADMINISTRADOR", "FISCAL"], // visible para ambos
    },
    {
      label: "Reporte Casos",
      icon: <Gavel />,
      path: "/reporteria/pt-caso",
      component: ReporteCasos,
      roles: ["ADMINISTRADOR"],
    },
  ],
  Gestion: [
    {
      label: "Casos",
      icon: <Gavel />,
      path: "/pt-caso",
      component: PT_CASO,
      roles: ["ADMINISTRADOR", "FISCAL"],
    },
  ],
  Catalogo: [
    {
      label: "Estado Caso",
      icon: <AssignmentInd />,
      path: "/pt-estado-caso",
      component: PT_ESTADO_CASO,
      roles: ["ADMINISTRADOR", "FISCAL"],
    },
    {
      label: "Tipo Caso",
      icon: <LibraryBooks />,
      path: "/pt-tipo-caso",
      component: PT_TIPO_CASO,
      roles: ["ADMINISTRADOR", "FISCAL"],
    },
    {
      label: "Fiscal",
      icon: <People />,
      path: "/pt-fiscal",
      component: PT_FISCAL,
      roles: ["ADMINISTRADOR", "FISCAL"],
    },
    {
      label: "Fiscalía",
      icon: <Business />,
      path: "/pt-fiscalia",
      component: PT_FISCALIA,
      roles: ["ADMINISTRADOR", "FISCAL"],
    },
    {
      label: "Usuarios",
      icon: <Person />,
      path: "/pt-usuario",
      component: PT_USUARIO,
      roles: ["ADMINISTRADOR"],
    },
    {
      label: "Roles",
      icon: <AdminPanelSettings />,
      path: "/pt-role",
      component: PT_ROLE,
      roles: ["ADMINISTRADOR"],
    },
    {
      label: "Permisos",
      icon: <ListAlt />,
      path: "/pt-permiso",
      component: PT_PERMISO,
      roles: ["ADMINISTRADOR"],
    },
    {
      label: "Personas",
      icon: <AccountBox />,
      path: "/pt-persona",
      component: PT_PERSONA,
      roles: ["ADMINISTRADOR", "FISCAL"],
    },
    {
      label: "Logs",
      icon: <ListAlt />,
      path: "/pt-logs",
      component: PT_LOGS,
      roles: ["TEST"],
    },
    {
      label: "Bitacora",
      icon: <ListAlt />,
      path: "/Bitacora",
      component: Bitacora,
      roles: ["ADMINISTRADOR"],
    },
  ],
};
