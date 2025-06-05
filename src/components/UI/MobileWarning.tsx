
import React, { useEffect, useState } from "react";

const MobileWarning: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      );
    if (isMobile) {
      setVisible(true);
    }
  }, []);



  if (!visible) return null;

  return (
    <div className="bg-yellow-100 text-yellow-900 p-4 text-sm text-center w-full shadow-md">
      ⚠️ Esta aplicación está optimizada para pantallas de escritorio. Puede que algunas interfaces se solapen en dispositivos móviles. Para una mejor experiencia, acceda desde un PC o un portátil.
    </div>
  );
};

export default MobileWarning;
