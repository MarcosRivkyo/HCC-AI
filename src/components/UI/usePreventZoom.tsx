import { useEffect } from "react";


function usePreventZoom(scrollCheck: boolean = true, keyboardCheck: boolean = true) {
  useEffect(() => {
    // Definición del evento de teclado
    const handleKeydown = (e: KeyboardEvent) => {
      if (
        keyboardCheck &&
        e.ctrlKey &&
        (e.keyCode === 61 ||  // "=" key
          e.keyCode === 107 || // "+" key (num pad)
          e.keyCode === 173 || // "-" key (num pad)
          e.keyCode === 109 || // "-" key (num pad)
          e.keyCode === 187 || // "+" key (main keyboard)
          e.keyCode === 189)   // "-" key (main keyboard)
      ) {
        e.preventDefault();
      }
    };

    // Definición del evento de rueda del ratón
    const handleWheel = (e: WheelEvent) => {
      if (scrollCheck && e.ctrlKey) {
        e.preventDefault();
      }
    };

    // Añadir los event listeners
    document.addEventListener("keydown", handleKeydown);
    document.addEventListener("wheel", handleWheel, { passive: false });

    // Cleanup: remover los event listeners al desmontar el componente
    return () => {
      document.removeEventListener("keydown", handleKeydown);
      document.removeEventListener("wheel", handleWheel);
    };
  }, [scrollCheck, keyboardCheck]); // Dependencias
}

export default usePreventZoom;
