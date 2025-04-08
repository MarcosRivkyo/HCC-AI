import React, { useState, useEffect } from 'react'; 
import { getStorage, ref, listAll, getDownloadURL } from 'firebase/storage';
import Slider from 'react-slick';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import '../../App.css';

interface ImageCarrouselProps {
  onImageSelect: (url: string) => void;
}

const ImageCarrousel: React.FC<ImageCarrouselProps> = ({ onImageSelect }) => {
  const [imagenes, setImagenes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  
  const storage = getStorage();
  const auth = getAuth();
  const user = auth.currentUser;

  const navigate = useNavigate(); // Hook para navegar a otras rutas

  useEffect(() => {
    const obtenerImagenes = async () => {
      if (user) {
        const imageFolder = `HCC-AI/users/${user.uid}/ecografias/`;
        const storageRef = ref(storage, imageFolder); // Usar imageFolder en la referencia
        try {
          const result = await listAll(storageRef);
          const urls: string[] = [];

          for (const item of result.items) {
            const url = await getDownloadURL(item);
            if (!urls.includes(url)) { // Verificar si la URL ya está en el array
              urls.push(url);
            }
          }

          setImagenes(urls);
        } catch (error) {
          console.error('Error al obtener las imágenes:', error);
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
    <div className="flex-1 bg-white rounded-lg shadow-md p-6 border border-gray-300">
      <main className="flex-1 overflow-auto">
        {loading ? (
          <p>Cargando imágenes...</p>
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
