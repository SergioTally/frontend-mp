import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import ProtectedLayout from "./components/ProtectedLayout";
import { groupedMenu } from "./config/menuConfig";
import Items from "./pages/Items";
import useAuth from "./hooks/useAuth";

const App = () => {
  const { isAuthenticated } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
        />
        {Object.values(groupedMenu)
          .flat()
          .map(({ path, component: Component, roles }) => (
            <Route
              key={path}
              path={path}
              element={
                <ProtectedRoute allowedRoles={roles}>
                  <ProtectedLayout>
                    {Component ? <Component /> : <Items />}
                  </ProtectedLayout>
                </ProtectedRoute>
              }
            />
          ))}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
