import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { useNavigate, useLocation } from "react-router-dom";

interface IAuthRouteProps {
  children: React.ReactNode;
}

const AuthRoute: React.FC<IAuthRouteProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  const auth = getAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      const isPublicRoute = ["/", "/login", "/signup"].includes(
        location.pathname,
      );

      if (!currentUser || !currentUser.emailVerified) {
        if (!isPublicRoute) {
          navigate("/login");
        }
        setUser(null);
      } else {
        setUser(currentUser);
        if (isPublicRoute) {
          navigate("/dashboard");
        }
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth, location.pathname, navigate]);

  if (loading) return null;

  const isPublicRoute = ["/", "/login", "/signup"].includes(location.pathname);
  if (!user && !isPublicRoute) return null;

  return <>{children}</>;
};

export default AuthRoute;
