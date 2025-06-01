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

import Dashboard from "../pages/Dashboard";
import PT_CASO from "../pages/Items";
import PT_ESTADO_CASO from "../pages/gestion/EstadoCaso";
import PT_TIPO_CASO from "../pages/gestion/TipoCaso";
import PT_FISCAL from "../pages/Items";
import PT_FISCALIA from "../pages/Items";
import PT_USUARIO from "../pages/catalogo/Usuarios";
import PT_ROLE from "../pages/catalogo/Roles";
import PT_PERMISO from "../pages/Items";
import PT_PERSONA from "../pages/Items";
import PT_LOGS from "../pages/Items";

export const groupedMenu = {
  Dashboard: [
    {
      label: "Inicio",
      icon: <DashboardIcon />,
      path: "/dashboard",
      component: Dashboard,
    },
  ],
  Gestion: [
    { label: "Casos", icon: <Gavel />, path: "/pt-caso", component: PT_CASO },
    {
      label: "Estado Caso",
      icon: <AssignmentInd />,
      path: "/pt-estado-caso",
      component: PT_ESTADO_CASO,
    },
    {
      label: "Tipo Caso",
      icon: <LibraryBooks />,
      path: "/pt-tipo-caso",
      component: PT_TIPO_CASO,
    },
    {
      label: "Fiscal",
      icon: <People />,
      path: "/pt-fiscal",
      component: PT_FISCAL,
    },
    {
      label: "Fiscalía",
      icon: <Business />,
      path: "/pt-fiscalia",
      component: PT_FISCALIA,
    },
  ],
  Catalogo: [
    {
      label: "Usuarios",
      icon: <Person />,
      path: "/pt-usuario",
      component: PT_USUARIO,
    },
    {
      label: "Roles",
      icon: <AdminPanelSettings />,
      path: "/pt-role",
      component: PT_ROLE,
    },
    {
      label: "Permisos",
      icon: <ListAlt />,
      path: "/pt-permiso",
      component: PT_PERMISO,
    },
    {
      label: "Personas",
      icon: <AccountBox />,
      path: "/pt-persona",
      component: PT_PERSONA,
    },
    { label: "Logs", icon: <ListAlt />, path: "/pt-logs", component: PT_LOGS },
  ],
};
