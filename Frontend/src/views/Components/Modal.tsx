// src/views/Components/Modal.tsx


import React from "react";


type ModalProps = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?: "small" | "medium" | "large";
};

const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  children,
  size = "medium",
}) => {
  if (!open) return null;

  const sizeClasses = {
    small: "w-80",
    medium: "w-96",
    large: "w-full max-w-4xl h-[80vh]",
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={onClose} // cerrar si se hace clic fuera
    >
      <div
        className={`bg-gray-800 dark:bg-gray-900 text-white p-8 rounded-lg shadow-lg ${sizeClasses[size]} relative`}
        onClick={(e) => e.stopPropagation()} // evitar que el clic se propague
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-white text-lg"
        >
          ✖
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
