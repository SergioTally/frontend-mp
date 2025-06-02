import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Box,
  Divider,
  Collapse,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";
import { groupedMenu } from "../config/menuConfig";
import { Logout } from "@mui/icons-material";
import { jwtDecode } from "jwt-decode";

const drawerWidth = 240;

const Sidebar = () => {
  const location = useLocation();
  const [openGroups, setOpenGroups] = useState({});
  const token = localStorage.getItem("token");
  let rol = "";

  if (token) {
    try {
      const decoded = jwtDecode(token);
      rol = decoded.rol || "";
    } catch (e) {
      console.error("Token inválido", e);
    }
  }

  const toggleGroup = (group) => {
    setOpenGroups((prev) => ({ ...prev, [group]: !prev[group] }));
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundColor: "#fff",
          borderRight: "1px solid #e0e0e0",
        },
      }}
    >
      <Toolbar sx={{ p: 2 }}>
        <Typography variant="h6" fontWeight="bold" color="primary">
          Panel Admin
        </Typography>
      </Toolbar>

      <Box sx={{ mt: 2 }}>
        {Object.entries(groupedMenu).map(([group, items]) => (
          <Box key={group} sx={{ mb: 2 }}>
            <ListItem button onClick={() => toggleGroup(group)} sx={{ px: 2 }}>
              <ListItemText
                primary={group}
                primaryTypographyProps={{
                  variant: "subtitle2",
                  color: "text.secondary",
                  fontWeight: "bold",
                }}
              />
              {openGroups[group] ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={openGroups[group]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {items
                  .filter((item) => item.roles?.includes(rol))
                  .map((item) => (
                    <ListItem
                      key={item.label}
                      button
                      component={Link}
                      to={item.path}
                      sx={{
                        mx: 1,
                        mb: 1,
                        borderRadius: 2,
                        backgroundColor:
                          location.pathname === item.path
                            ? "#e3f2fd"
                            : "transparent",
                        color:
                          location.pathname === item.path
                            ? "primary.main"
                            : "text.primary",
                        "&:hover": {
                          backgroundColor: "#f5f5f5",
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          color:
                            location.pathname === item.path
                              ? "primary.main"
                              : "inherit",
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText primary={item.label} />
                    </ListItem>
                  ))}
              </List>
            </Collapse>
            <Divider />
          </Box>
        ))}
      </Box>
      <ListItem
        button
        onClick={() => {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }}
        sx={{
          mx: 2,
          mt: 2,
          borderRadius: 2,
          backgroundColor: "#ffebee",
          "&:hover": { backgroundColor: "#ffcdd2" },
        }}
      >
        <ListItemIcon sx={{ color: "error.main" }}>
          <Logout />
        </ListItemIcon>
        <ListItemText
          primary="Cerrar Sesión"
          primaryTypographyProps={{
            fontWeight: "bold",
            color: "error.main",
          }}
        />
      </ListItem>
    </Drawer>
  );
};

export default Sidebar;
