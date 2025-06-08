import React, { useState, useEffect } from "react";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import Slider from "react-slick";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "../../App.css";
import logoHCCDark from "../../assets/images/logo_hcc_ai_bg.jpg";

interface ImageCarrouselProps {
  onImageSelect: (url: string) => void;
}

const ImageCarrousel: React.FC<ImageCarrouselProps> = ({ onImageSelect }) => {
  const [imagenes, setImagenes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const storage = getStorage();
  const auth = getAuth();
  const user = auth.currentUser;

  const navigate = useNavigate();

  useEffect(() => {
    const obtenerImagenes = async () => {
      if (user) {
        const userId = user.uid;

        const folderPath = `HCC-AI/users/${userId}/images/masks`;

        const storageRef = ref(storage, folderPath);
        try {
          const result = await listAll(storageRef);
          const urls: string[] = [];

          for (const item of result.items) {
            const url = await getDownloadURL(item);
            if (!urls.includes(url)) {
              urls.push(url);
            }
          }

          setImagenes(urls);
        } catch (error) {
          console.error("Error al obtener las imágenes:", error);
        }
      }
      setLoading(false);
    };

    if (user) {
      obtenerImagenes();
    } else {
      setLoading(false);
    }
  }, [user, storage]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: true,
  };

  const handleImageClick = (url: string, event: React.MouseEvent) => {
    event.stopPropagation();
    onImageSelect(url);
    navigate(`/editar-imagen?imageUrl=${encodeURIComponent(url)}`);
  };

  return (
    <div className="flex-1 bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 border border-gray-300 dark:border-gray-700">
      <main className="flex-1 overflow-auto">
        {loading ? (
            <div className="flex items-center justify-center h-64 relative">
              <div className="relative w-32 h-32 flex items-center justify-center">

                <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>

                <img
                  src={logoHCCDark}
                  alt="Cargando..."
                  className="w-20 h-12 object-contain rounded-full"
                />
              </div>
            </div>
        ) : (
          <Slider {...settings}>
            {imagenes.length > 0 ? (
              imagenes.map((url, index) => (
                <div key={index} onClick={(e) => handleImageClick(url, e)}>
                  <img
                    src={url}
                    alt={`Imagen ${index + 1}`}
                    className="w-full h-64 object-contain rounded-lg cursor-pointer"
                  />
                </div>
              ))
            ) : (
              <p>No se encontraron imágenes.</p>
            )}
          </Slider>
        )}
      </main>
    </div>
  );
};

export default ImageCarrousel;
