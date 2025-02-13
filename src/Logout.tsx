import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const auth = getAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                console.log("Sesión cerrada");
                navigate('/login'); 
            })
            .catch(error => {
                console.error("Error al cerrar sesión:", error);
            });
    };

    return (
        <button  onClick={handleLogout} className="w-full text-left px-4 py-3 hover:bg-red-600 text-red-400">
        🚪 Cerrar Sesión
        </button>
    );
};

export default Logout;
