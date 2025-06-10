import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthDAO } from "../data/dao/AuthDAO";
import { UserDAO } from "../data/dao/UserDAO";
import { User } from "firebase/auth";

export function useAuthRouteViewModel() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = AuthDAO.subscribeToAuthChanges(async (currentUser) => {
      const isPublicRoute = ["/", "/login", "/signup"].includes(
        location.pathname,
      );

      if (!currentUser || !currentUser.emailVerified) {
        if (!isPublicRoute) navigate("/login");
        setUser(null);
        setLoading(false);
        return;
      }

      setUser(currentUser);

      try {
        const rol = await UserDAO.getUserRole(currentUser.uid);

        if (!rol) {
          console.warn("No se encontró el rol del usuario");
          navigate("/login");
          setLoading(false);
          return;
        }

        if (isPublicRoute) {
          if (rol === "Paciente") navigate("/dashboard-patient");
          else if (rol === "Médico" || rol === "Administrador")
            navigate("/dashboard");
          else navigate("/login");
        }

        if (!isPublicRoute) {
          if (
            rol === "Paciente" &&
            !(
              location.pathname === "/dashboard-patient" ||
              location.pathname.startsWith("/estudio/")
            )
          ) {
            navigate("/dashboard-patient");
          }

          if (
            (rol === "Médico" || rol === "Administrador") &&
            location.pathname === "/dashboard-patient"
          ) {
            navigate("/dashboard");
          }
        }
      } catch (error) {
        console.error("Error al validar rol:", error);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [location.pathname, navigate]);

  return { loading, user };
}
