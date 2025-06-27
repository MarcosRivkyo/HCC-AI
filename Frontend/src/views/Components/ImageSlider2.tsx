// src/views/Components/ImageSlider2.tsx

import { useState, useEffect } from "react";
import aiHealth from "../../assets/images/hcc_img_liver.png";
import aiHealth3 from "../../assets/images/hcc_img_2.png";
import aiHealth2 from "../../assets/images/hcc-ai_image2.jpg";

const images: string[] = [aiHealth, aiHealth3, aiHealth2];

const ImageSlider2: React.FC = () => {
  const [currentImage, setCurrentImage] = useState<number>(0);
  const [fade, setFade] = useState<boolean>(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentImage((prev) => (prev + 1) % images.length);
        setFade(true);
      }, 800);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-screen flex items-center justify-center">
      <img
        src={images[currentImage]}
        alt="Imagen Cambiante"
        className={`w-full h-full object-cover transition-opacity duration-700 ${
          fade ? "opacity-100" : "opacity-0"
        }`}
      />

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
