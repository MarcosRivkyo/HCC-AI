import React from "react";
import { useLocation } from "react-router-dom";
import { useAuthRouteViewModel } from "../../viewmodels/useAuthRouteViewModel";

interface IAuthRouteProps {
  children: React.ReactNode;
}

const AuthRoute: React.FC<IAuthRouteProps> = ({ children }) => {
  const { loading, user } = useAuthRouteViewModel();
  const location = useLocation();

  const isPublicRoute = ["/", "/login", "/signup"].includes(location.pathname);

  if (loading) return null;
  if (!user && !isPublicRoute) return null;

  return <>{children}</>;
};

export default AuthRoute;
