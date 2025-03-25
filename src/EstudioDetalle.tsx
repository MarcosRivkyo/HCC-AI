import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { app } from './config/firebase';

type Estudio = {
  studieName: string;
  status: string;
  studieDate: any;
  descripcion?: string; // Agrega un campo de descripción
  imagenUrl?: string; // Agrega un campo para la imagen
};

const EstudioDetalle = () => {
  const { id } = useParams();
  const [estudio, setEstudio] = useState<Estudio | null>(null);
  const db = getFirestore(app);

  useEffect(() => {
    const fetchEstudioDetalle = async () => {
      try {
        if (id) {
          const docRef = doc(db, 'hcc_ai_studies', id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setEstudio(docSnap.data() as Estudio);
          } else {
            console.log('No hay datos para este estudio');
          }
        } else {
          console.log('ID del estudio no está definido');
        }
      } catch (error) {
        console.error('Error al obtener el detalle del estudio:', error);
      }
    };

    fetchEstudioDetalle();
  }, [id]);

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {estudio ? (
        <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">{estudio.studieName}</h2>
            <p className="text-xl text-gray-500 mt-2">{estudio.status}</p>
            <p className="text-gray-400 text-sm mt-1">
              {estudio.studieDate?.toDate().toLocaleString('es-ES', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>

          {/* Imagen del estudio */}
          {estudio.imagenUrl && (
            <div className="mb-6">
              <img
                src={estudio.imagenUrl}
                alt="Imagen del estudio"
                className="w-full h-auto rounded-lg shadow-md"
              />
            </div>
          )}

          {/* Descripción del estudio */}
          {estudio.descripcion && (
            <div className="mb-6">
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">Descripción</h3>
              <p className="text-gray-600">{estudio.descripcion}</p>
            </div>
          )}

          {/* Botón para añadir imagen */}
          <div className="flex justify-center mb-4">
            <button className="bg-blue-500 text-white px-6 py-2 rounded-full shadow-md hover:bg-blue-600">
              Añadir Imagen
            </button>
          </div>

          {/* Acción adicional (si fuera necesario) */}
          <div className="flex justify-center">
            <button className="bg-green-500 text-white px-6 py-2 rounded-full shadow-md hover:bg-green-600 mr-4">
              Realizar Acción
            </button>
            <button className="bg-red-500 text-white px-6 py-2 rounded-full shadow-md hover:bg-red-600">
              Eliminar Estudio
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-500 text-lg">Cargando...</p>
      )}
    </div>
  );
};

export default EstudioDetalle;
