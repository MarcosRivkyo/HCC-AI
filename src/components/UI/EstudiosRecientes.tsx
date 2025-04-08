import React, { useState, useEffect } from 'react';
import { getFirestore, collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { app } from '../../config/firebase';
import { useNavigate } from 'react-router-dom';
import { FaEllipsisV, FaDownload, FaTrashAlt } from 'react-icons/fa'; // Importa los íconos

const EstudiosRecientes = () => {
  const [estudios, setEstudios] = useState<{ id: string; [key: string]: any }[]>([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const estudiosPorPagina = 5;
  const [menuActivo, setMenuActivo] = useState<string | null>(null); // Estado para controlar el menú activo
  const [confirmarEliminacion, setConfirmarEliminacion] = useState<string | null>(null); // Para confirmar la eliminación

  const db = getFirestore(app);
  const auth = getAuth(app);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEstudios = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const q = query(
          collection(db, 'hcc_ai_studies'),
          where('medicoId', '==', user.uid)
        );

        const querySnapshot = await getDocs(q);
        const estudiosDelUsuario = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setEstudios(estudiosDelUsuario);
      } catch (error) {
        console.error('Error al obtener los estudios:', error);
      }
    };

    fetchEstudios();
  }, []);

  const indicesDeEstudios = (paginaActual - 1) * estudiosPorPagina;
  const estudiosPaginados = estudios.slice(indicesDeEstudios, indicesDeEstudios + estudiosPorPagina);

  const siguientePagina = () => {
    if (paginaActual * estudiosPorPagina < estudios.length) {
      setPaginaActual(paginaActual + 1);
    }
  };

  const paginaAnterior = () => {
    if (paginaActual > 1) {
      setPaginaActual(paginaActual - 1);
    }
  };

  const verEstudioDetalle = (id: string) => {
    navigate(`/estudio/${id}`);
  };

  const eliminarEstudio = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'hcc_ai_studies', id));
      setEstudios(estudios.filter(estudio => estudio.id !== id)); // Actualiza el estado para eliminar el estudio
      setConfirmarEliminacion(null); // Cierra la confirmación de eliminación
    } catch (error) {
      console.error('Error al eliminar el estudio:', error);
    }
  };

  const descargarEstudio = (id: string) => {
    // Aquí va la lógica para descargar el estudio
    console.log('Descargando estudio:', id);
  };

  return (
    <div className="w-full h-full bg-white rounded-lg shadow-md p-6 border border-gray-300 mr-6">
      <div className="flex justify-between items-center text-gray-700 font-semibold p-4 bg-gray-200 rounded-t-lg shadow-sm">
        <span className="w-1/3 text-center">Nombre del Estudio</span>
        <span className="w-1/3 text-center">Estado</span>
        <span className="w-1/3 text-center">Fecha de Estudio</span>
      </div>

      <ul className="space-y-4 mb-4">
        {estudiosPaginados.length > 0 ? (
          estudiosPaginados.map((estudio, index) => (
            <li
              key={index}
              className="p-4 bg-gray-100 rounded-lg shadow-sm flex justify-between items-center gap-4 hover:shadow-md transition-shadow"
            >
              <h3
                className="text-lg font-semibold text-gray-800 w-1/3 truncate cursor-pointer"
                onClick={() => verEstudioDetalle(estudio.id)} // Navega al detalle al hacer click en el nombre
              >
                {estudio.studieName || `Estudio ${index + 1}`}
              </h3>

              <div className="flex items-center w-1/3">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    estudio.status === 'Finished'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {estudio.status}
                </span>
              </div>

              <p className="text-sm text-gray-600 w-1/3 text-right">
                {estudio.studieDate?.toDate
                  ? estudio.studieDate.toDate().toLocaleString('es-ES', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : 'Fecha no disponible'}
              </p>

              {/* Botón de tres puntos */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Detener la propagación del evento
                    setMenuActivo(menuActivo === estudio.id ? null : estudio.id);
                  }}
                  className="text-gray-600 hover:text-gray-800 focus:outline-none menu-btn"
                >
                  <FaEllipsisV />
                </button>

                {/* Menú de opciones */}
                {menuActivo === estudio.id && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg p-2 z-10">
                    <button
                      onClick={() => descargarEstudio(estudio.id)}
                      className="w-full flex items-center p-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <FaDownload className="mr-2" />
                      Descargar Estudio
                    </button>
                    <button
                      onClick={() => setConfirmarEliminacion(estudio.id)}
                      className="w-full flex items-center p-2 text-sm text-red-600 hover:bg-red-100"
                    >
                      <FaTrashAlt className="mr-2" />
                      Eliminar Estudio
                    </button>
                  </div>
                )}
              </div>
            </li>
          ))
        ) : (
          <p className="text-gray-500">No hay estudios recientes.</p>
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
          Página {paginaActual} de {Math.ceil(estudios.length / estudiosPorPagina) || 1}
        </span>
        <button
          onClick={siguientePagina}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300"
          disabled={paginaActual * estudiosPorPagina >= estudios.length}
        >
          Siguiente
        </button>
      </div>

      {/* Confirmación de eliminación */}
      {confirmarEliminacion && (
        <div className="absolute inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center" style={{ zIndex: 1000 }}>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">¿Estás seguro de eliminar este estudio?</h3>
            <div className="flex justify-between">
              <button
                onClick={() => eliminarEstudio(confirmarEliminacion)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg"
              >
                Eliminar
              </button>
              <button
                onClick={() => setConfirmarEliminacion(null)} // Cierra la confirmación
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EstudiosRecientes;
