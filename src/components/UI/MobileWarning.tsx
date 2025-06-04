import React from "react";

const MobileWarning: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-white dark:bg-black z-50 flex flex-col items-center justify-center p-8 text-center">
      <h1 className="text-2xl font-bold mb-4">Aplicación optimizada para escritorio</h1>
      <p className="text-lg">
        Esta aplicación está optimizada para pantallas de escritorio.
        Puede que algunas interfaces se solapen en dispositivos móviles
        Para una mejor experiencia, acceda desde un PC o un portátil.
      </p>
    </div>
  );
};

export default MobileWarning;
