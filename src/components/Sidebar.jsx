import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Dashboard, ListAlt } from "@mui/icons-material";
import { Link } from "react-router-dom";

const Sidebar = () => (
  <Drawer variant="permanent">
    <List>
      <ListItem button component={Link} to="/dashboard">
        <ListItemIcon>
          <Dashboard />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItem>
      <ListItem button component={Link} to="/items">
        <ListItemIcon>
          <ListAlt />
        </ListItemIcon>
        <ListItemText primary="CRUD Items" />
      </ListItem>
    </List>
  </Drawer>
);

export default Sidebar;
