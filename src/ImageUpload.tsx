import React, { useState } from 'react';

const ImageUpload = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Manejar la carga de la imagen
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedImage(e.target.files[0]);
    }
  };

  // Enviar la imagen al backend
  const handleUpload = async () => {
    if (!selectedImage) return;

    const formData = new FormData();
    formData.append('data', selectedImage);

    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/upload/', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      setPrediction(result.result);
      console.error('Respuesta:', response);

    } catch (error) {
      console.error('Error al subir la imagen:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Cargar imagen para predicción</h2>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? 'Cargando...' : 'Predecir'}
      </button>

      {prediction && (
        <div className="prediction">
            <h3>Predicción: {prediction}</h3>
        </div>
     )}
    </div>
  );
};

export default ImageUpload;
