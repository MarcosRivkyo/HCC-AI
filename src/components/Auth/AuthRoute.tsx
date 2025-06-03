import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { useNavigate, useLocation } from "react-router-dom";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app } from "../../config/firebase";

interface IAuthRouteProps {
  children: React.ReactNode;
}

const AuthRoute: React.FC<IAuthRouteProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  const auth = getAuth();
  const db = getFirestore(app);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
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
        const docRef = doc(db, "hcc_ai_users", currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          const rol = userData.rol;

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
        } else {
          console.warn("No existe el documento del usuario en Firestore.");
          navigate("/login");
        }
      } catch (error) {
        console.error("Error obteniendo el rol del usuario:", error);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [auth, location.pathname, navigate]);

  if (loading) return null;

  const isPublicRoute = ["/", "/login", "/signup"].includes(location.pathname);
  if (!user && !isPublicRoute) return null;

  return <>{children}</>;
};

export default AuthRoute;
