import React, { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  getDocs,
  where,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { app } from "../../config/firebase";
import { useNavigate } from "react-router-dom";

const EstudiosRecientesCompact: React.FC = () => {
  const [estudios, setEstudios] = useState<
    { id: string; [key: string]: any }[]
  >([]);
  const db = getFirestore(app);
  const auth = getAuth(app);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEstudios = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const q = query(
          collection(db, "hcc_ai_studies"),
          where("doctorId", "==", user.uid),
          orderBy("studieDate", "desc"),
        );
        const querySnapshot = await getDocs(q);
        const estudiosDelUsuario = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEstudios(estudiosDelUsuario.slice(0, 5));
      } catch (error) {
        console.error("Error al obtener estudios:", error);
      }
    };

    fetchEstudios();
  }, []);

  const irADetalle = (id: string) => {
    navigate(`/estudio/${id}`);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 w-full md:w-64">
      <h3 className="text-lg font-bold text-gray-800 mb-4">
        Estudios recientes
      </h3>
      <ul className="space-y-3">
        {estudios.map((estudio) => (
          <li
            key={estudio.id}
            onClick={() => irADetalle(estudio.id)}
            className="flex items-center space-x-3 bg-gray-100 hover:bg-gray-200 p-2 rounded-lg cursor-pointer transition"
          >
            {estudio.imagenUrl ? (
              <img
                src={estudio.imagenUrl}
                alt="Miniatura"
                className="w-12 h-12 rounded-md object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-md bg-gray-300 flex items-center justify-center text-gray-500 text-xs"></div>
            )}
            <div className="flex-1">
              <p className="text-sm font-medium truncate text-gray-800">
                {estudio.studieName || "Sin nombre"}
              </p>
              <p className="text-xs text-gray-500">
                {estudio.studieDate?.toDate?.().toLocaleDateString("es-ES")}
              </p>
              <span
                className={`inline-block text-[10px] mt-1 px-2 py-[1px] rounded-full font-medium ${
                  estudio.status === "Finalizado"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {estudio.status}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EstudiosRecientesCompact;
