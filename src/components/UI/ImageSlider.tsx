import { useState, useEffect } from "react";
import aiHealth from "../../assets/images/ai_health.jpg";
import aiHealth2 from "../../assets/images/ai_health2.jpg";

const images: string[] = [aiHealth, aiHealth2];

const ImageSlider: React.FC = () => {
  const [currentImage, setCurrentImage] = useState<number>(0);
  const [fade, setFade] = useState<boolean>(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false); // Inicia el efecto de salida

      setTimeout(() => {
        setCurrentImage((prev) => (prev + 1) % images.length);
        setFade(true); // Activa el efecto de entrada
      }, 800);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <img
        src={images[currentImage]}
        alt="Imagen Cambiante"
        className={`w-full h-full object-cover transition-opacity duration-700 ${
          fade ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
};

export default ImageSlider;
