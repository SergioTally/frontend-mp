import { useMemo } from "react";
import { jwtDecode } from "jwt-decode";

const useAuth = () => {
  const token = localStorage.getItem("token");

  const user = useMemo(() => {
    try {
      return token ? jwtDecode(token) : null;
    } catch {
      return null;
    }
  }, [token]);

  const isAuthenticated = !!token;
  const role = user?.rol || null;

  return { isAuthenticated, user, role };
};

export default useAuth;
