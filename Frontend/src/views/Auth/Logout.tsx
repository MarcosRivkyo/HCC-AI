// src/views/Auth/Logout.tsx

import { useLogoutViewModel } from "../../viewmodels/useLogoutViewModel";
import { useTranslation } from "react-i18next";
import { FaSignOutAlt } from "react-icons/fa";

const Logout = () => {
  const [t] = useTranslation("global");
  const { logout } = useLogoutViewModel();

  return (
    <button
      onClick={logout}
      className="w-full text-left px-4 py-3 hover:bg-red-600 text-red-400 flex items-center"
    >
      <FaSignOutAlt className="mr-2" />
      {t("navbar.logout")}
    </button>
  );
};

export default Logout;
