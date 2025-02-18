import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate, useLocation } from 'react-router-dom';

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
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
            
            if (currentUser && (location.pathname === "/login" || location.pathname === "/signup")) {
                navigate("/dashboard");
            }
            if (!currentUser && location.pathname === "/dashboard") {
                navigate("/login");
            }
        });

        return () => unsubscribe();
    }, [auth, navigate, location]);

    if (loading) {
        return <p>Cargando...</p>;
    }

    return <>{children}</>;

    
};

export default AuthRoute;
