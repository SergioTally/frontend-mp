import React from "react";
import { Box } from "@mui/material";
import Sidebar from "./Sidebar";

const drawerWidth = 240;

const ProtectedLayout = ({ children }) => {
  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          minHeight: "100vh",
          backgroundColor: "#f5f5f5",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default ProtectedLayout;
