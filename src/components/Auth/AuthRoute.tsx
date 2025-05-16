import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate, useLocation } from "react-router-dom";

import logoHCC_AI from "../../assets/images/logo_hcc_ai.jpg";

export interface IAuthRouteProps {
  children: React.ReactNode;
}

const AuthRoute: React.FC<IAuthRouteProps> = ({ children }) => {
  const auth = getAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

useEffect(() => {
  const startTime = Date.now();

  const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    const elapsedTime = Date.now() - startTime;
    const delay = Math.max(1000 - elapsedTime, 0);

    setTimeout(() => {
      const isPublicRoute = ["/", "/login", "/signup"].includes(location.pathname);

      if (!currentUser || !currentUser.emailVerified) {
        console.log("User not authenticated or email not verified:", currentUser);

        if (!isPublicRoute) {
          navigate("/login");
        }
      } else {
        if (["/login", "/signup"].includes(location.pathname)) {
          navigate("/dashboard");
        }
      }

      setLoading(false);
    }, delay);
  });

  return () => unsubscribe();
}, [auth, navigate, location]);


  if (loading) {
    return (
      <div className="fixed top-0 left-0 w-full h-full bg-black flex justify-center items-center">
        <div className="relative w-32 h-32 border-8 border-gray-300 border-solid border-t-transparent rounded-full animate-spin">
          <img
            src={logoHCC_AI}
            alt="Logo"
            className="absolute inset-0 w-full h-full p-4 object-contain"
          />
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthRoute;
