import { useNavigate } from "react-router-dom";
import { AuthDAO } from "../data/dao/AuthDAO";

export function useLogoutViewModel() {
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await AuthDAO.logout();
      console.log("Sesión cerrada");
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return { logout };
}
