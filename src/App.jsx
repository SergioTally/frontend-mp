import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import ProtectedLayout from "./components/ProtectedLayout";
import { groupedMenu } from "./config/menuConfig";
import Items from "./pages/Items";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login />} />
      {Object.values(groupedMenu)
        .flat()
        .map(({ path, component: Component }) => (
          <Route
            key={path}
            path={path}
            element={
              <ProtectedRoute>
                <ProtectedLayout>
                  {Component ? <Component /> : <Items />}
                </ProtectedLayout>
              </ProtectedRoute>
            }
          />
        ))}
    </Routes>
  </BrowserRouter>
);

export default App;
