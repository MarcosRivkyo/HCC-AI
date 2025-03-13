import { useState, useEffect } from "react";
import aiHealth from "../../assets/images/hcc_img_liver.png";
import aiHealth3 from "../../assets/images/hcc_img_2.png";

const images: string[] = [aiHealth, aiHealth3];

const ImageSlider2: React.FC = () => {
  const [currentImage, setCurrentImage] = useState<number>(0);
  const [fade, setFade] = useState<boolean>(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false); // Inicia el efecto de salida
      setTimeout(() => {
        setCurrentImage((prev) => (prev + 1) % images.length); // Cambia a la siguiente imagen
        setFade(true); // Activa el efecto de entrada
      }, 800); // Duración del efecto de salida
    }, 8000); // Cambio automático cada 8 segundos

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-screen flex items-center justify-center">
      {/* Imagen con efecto de transición */}
      <img
        src={images[currentImage]}
        alt="Imagen Cambiante"
        className={`w-full h-full object-cover transition-opacity duration-700 ${
          fade ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Indicadores */}
      <div className="absolute bottom-6 flex space-x-2">
        {images.map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full ${
              index === currentImage ? "bg-red-500" : "bg-gray-500"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default ImageSlider2;
