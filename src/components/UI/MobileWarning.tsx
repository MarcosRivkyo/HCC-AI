
import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";

const MobileWarning: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem("dismissedMobileWarning");
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      );

    if (isMobile && !dismissed) {
      setVisible(true);
    }
  }, []);

  const handleClose = () => {
    setVisible(false);
    sessionStorage.setItem("dismissedMobileWarning", "true");
  };

  if (!visible) return null;

  return (
    <div className="bg-yellow-100 text-yellow-900 p-4 text-sm text-center relative z-50">
      ⚠️ Esta aplicación está optimizada para pantallas de escritorio. Puede que algunas interfaces se solapen en dispositivos móviles. Para una mejor experiencia, acceda desde un PC o un portátil.
      <button
        onClick={handleClose}
        className="absolute right-4 top-2 text-yellow-900 hover:text-red-600"
        aria-label="Cerrar advertencia"
      >
        <IoClose size={20} />
      </button>
    </div>
  );
};

export default MobileWarning;
