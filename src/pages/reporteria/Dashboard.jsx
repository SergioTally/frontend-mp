import React from "react";
import { Typography, Box, Grid, Paper, Avatar, Stack } from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import GroupIcon from "@mui/icons-material/Group";
import BarChartIcon from "@mui/icons-material/BarChart";

const stats = [
  {
    title: "Casos activos",
    value: 0,
    icon: <AssignmentIcon />,
    color: "#1976d2",
  },
  {
    title: "Fiscales asignados",
    value: 0,
    icon: <GroupIcon />,
    color: "#9c27b0",
  },
  {
    title: "Reportes generados",
    value: 0,
    icon: <BarChartIcon />,
    color: "#ff9800",
  },
];

const Dashboard = () => {
  return (
    <Box
      sx={{
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
        p: 4,
      }}
    >
      <Typography variant="h4" fontWeight="bold" mb={4}>
        Bienvenido al Panel
      </Typography>

      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                borderRadius: 3,
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Avatar sx={{ bgcolor: stat.color, width: 56, height: 56 }}>
                {stat.icon}
              </Avatar>
              <Stack>
                <Typography variant="subtitle2" color="textSecondary">
                  {stat.title}
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {stat.value}
                </Typography>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard;
