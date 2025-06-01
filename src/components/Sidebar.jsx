import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Box,
} from "@mui/material";
import { Dashboard, ListAlt } from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";

const drawerWidth = 240;

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { label: "Dashboard", icon: <Dashboard />, path: "/dashboard" },
    { label: "CRUD Items", icon: <ListAlt />, path: "/items" },
  ];

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
        <List>
          {menuItems.map((item) => (
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
                  location.pathname === item.path ? "#e3f2fd" : "transparent",
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
      </Box>
    </Drawer>
  );
};

export default Sidebar;
