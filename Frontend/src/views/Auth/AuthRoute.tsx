// src/views/Auth/AuthRoute.tsx

import React from "react";
import { useLocation } from "react-router-dom";
import { useAuthRouteViewModel } from "../../viewmodels/useAuthRouteViewModel";

interface IAuthRouteProps {
  children: React.ReactNode;
}

const AuthRoute: React.FC<IAuthRouteProps> = ({ children }) => {
  const { loading, user } = useAuthRouteViewModel();
  const location = useLocation();

  const isPublicRoute = ["/", "/login", "/signup", "/docs"].includes(location.pathname);

  if (loading) return null;
  if (!user && !isPublicRoute){ console.log("Acceso denegado"); return null;}

  return <>{children}</>;
};

export default AuthRoute;
