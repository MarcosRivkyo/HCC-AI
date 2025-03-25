import React, { useState, useEffect } from 'react';
import { getFirestore, collection, query, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { app } from './config/firebase';

const ModelosDisponibles = () => {
  const [modelos, setModelos] = useState<{ id: string; [key: string]: any }[]>([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const modelosPorPagina = 5;

  const db = getFirestore(app);
  const auth = getAuth(app);

  useEffect(() => {
    const fetchModelos = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const q = query(collection(db, 'hcc_ai_models'));
        const querySnapshot = await getDocs(q);

        const modelosDisponibles = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setModelos(modelosDisponibles);
      } catch (error) {
        console.error('Error al obtener los modelos:', error);
      }
    };

    fetchModelos();
  }, []);

  const indiceInicio = (paginaActual - 1) * modelosPorPagina;
  const modelosPaginados = modelos.slice(indiceInicio, indiceInicio + modelosPorPagina);

  const siguientePagina = () => {
    if (paginaActual * modelosPorPagina < modelos.length) {
      setPaginaActual(paginaActual + 1);
    }
  };

  const paginaAnterior = () => {
    if (paginaActual > 1) {
      setPaginaActual(paginaActual - 1);
    }
  };

  return (<div className="w-full h-full bg-white rounded-lg shadow-md p-6 border border-gray-300 mr-6">
    {/* Cabecera de las columnas */}
    <div className="flex justify-between items-center text-gray-700 font-semibold p-4 bg-gray-200 rounded-t-lg shadow-sm">
      <span className="w-1/3 text-center">Nombre del Modelo</span>
      <span className="w-1/3 text-center">Descripción</span>
      <span className="w-1/3 text-center">Tipo de Modelo</span>
      <span className="w-1/3 text-center">Fecha de Entrenamiento</span>
    </div>
  
    <ul className="space-y-4 mb-4">
      {modelosPaginados.length > 0 ? (
        modelosPaginados.map((modelo, index) => (
          <li
            key={modelo.id}
            className="p-4 bg-white rounded-lg shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-xl transition-shadow"
          >
            {/* Nombre del modelo */}
            <h3 className="text-lg font-semibold text-gray-800 w-full md:w-1/3 truncate">
              {modelo.modelName || `Modelo ${index + 1}`}
            </h3>
  
            {/* Descripción */}
            <p className="text-sm text-gray-600 italic w-full md:w-1/3 md:text-center">
              {modelo.description || 'Descripción no disponible'}
            </p>
  
            {/* Tipo de modelo */}
            <span className="text-sm font-medium text-gray-700 w-full md:w-1/3 text-center">
              {modelo.modelType || 'Tipo no disponible'}
            </span>
  
            {/* Fecha de entrenamiento */}
            <p className="text-sm text-gray-600 w-full md:w-1/3 text-center mt-2 md:mt-0">
              {modelo.trainDate?.toDate
                ? modelo.trainDate.toDate().toLocaleString('es-ES', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : 'Fecha no disponible'}
            </p>
          </li>
        ))
      ) : (
        <p className="text-gray-500">No hay modelos disponibles.</p>
      )}
    </ul>
  
    {/* Paginación */}
    <div className="flex justify-between items-center mt-4">
      <button
        onClick={paginaAnterior}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300"
        disabled={paginaActual === 1}
      >
        Anterior
      </button>
      <span className="text-gray-600">
        Página {paginaActual} de {Math.ceil(modelos.length / modelosPorPagina) || 1}
      </span>
      <button
        onClick={siguientePagina}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300"
        disabled={paginaActual * modelosPorPagina >= modelos.length}
      >
        Siguiente
      </button>
    </div>
  </div>
  
  );
};

export default ModelosDisponibles;
