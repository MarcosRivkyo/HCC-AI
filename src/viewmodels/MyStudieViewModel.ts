// src/viewmodels/useMisEstudios.ts
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getFirestore,
  collection,
  query,
  where,
  orderBy,
  getDocs,
  getDoc,
  deleteDoc,
  doc,
  addDoc,
  Timestamp,
} from "firebase/firestore";

import { app } from "../config/firebase";
import { Study } from "../models/Studies";
import { ref } from "firebase/storage";

export const useMisEstudios = () => {
  const [estudios, setEstudios] = useState<Study[]>([]);
  const [user, setUser] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [vista, setVista] = useState<"mios" | "compartidos" | "todos">("mios");
  const auth = getAuth(app);
  const db = getFirestore(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userDoc = await getDocs(
          query(
            collection(db, "hcc_ai_users"),
            where("__name__", "==", currentUser.uid)
          )
        );
        if (!userDoc.empty) {
          setUserData(userDoc.docs[0].data());
        }
      }
    });
    return () => unsubscribe();
  }, [db]);

  useEffect(() => {
    const fetchEstudios = async () => {
      if (!user) return;

      try {
        const q = query(collection(db, "hcc_ai_studies"), orderBy("studieDate", "desc"));
        const snapshot = await getDocs(q);

        const estudiosFiltrados = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((estudio: any) => {
            if (vista === "mios") {
              return estudio.doctorId === user.uid;
            } else if (vista === "compartidos") {
              return Array.isArray(estudio.sharedWithDoctorIds) && estudio.sharedWithDoctorIds.includes(user.uid);
            } else {
              return (
                estudio.doctorId === user.uid ||
                (Array.isArray(estudio.sharedWithDoctorIds) && estudio.sharedWithDoctorIds.includes(user.uid))
              );
            }
          });

        setEstudios(estudiosFiltrados as Study[]);
      } catch (error) {
        console.error("Error al obtener estudios:", error);
      }
    };

    fetchEstudios();
  }, [user, vista]);

  const crearEstudio = async (formData: any) => {
    if (!user) return;

    const existingQuery = query(
      collection(db, "hcc_ai_studies"),
      where("studieName", "==", formData.studieName),
      where("doctorId", "==", user.uid)
    );
    const existingSnapshot = await getDocs(existingQuery);
    if (!existingSnapshot.empty) throw new Error("Ya existe un estudio con ese nombre");

    const finalDate = new Date(formData.studieDate);
    finalDate.setHours(12);
    const studieDateTimestamp = Timestamp.fromDate(finalDate);

    await addDoc(collection(db, "hcc_ai_studies"), {
      ...formData,
      studieDate: studieDateTimestamp,
      doctorId: user.uid,
      doctorName: userData?.firstName || user.displayName || user.email,
    });

    const snapshot = await getDocs(
      query(collection(db, "hcc_ai_studies"), where("doctorId", "==", user.uid), orderBy("studieDate", "desc"))
    );
    const nuevosEstudios = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Study[];
    setEstudios(nuevosEstudios);
  };

  const eliminarEstudioVM = async (id: string) => {

    const estudioRef = doc(db, "hcc_ai_studies", id);
    const estudioSnap = await getDoc(estudioRef);

    if (estudioSnap.exists()) {
      const estudioData = estudioSnap.data();
      const predictionId = estudioData.predictionId;

      if (predictionId) {
        try {
          await deleteDoc(doc(db, "hcc_ai_predictions", predictionId));
        } catch (e) {
          console.warn("No se pudo borrar la predicción asociada:", e);
        }
      }
    await deleteDoc(estudioRef);
    
    } else {
      throw new Error("El estudio no existe.");
    }

  };

  const refetchEstudios = async () => {
    const estudiosRef = collection(db, "hcc_ai_studies");
    const q = query(estudiosRef, where("doctorId", "==", user.uid)); // o tu filtro
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Study[];
    setEstudios(data);
  };

  return {
    user,
    userData,
    estudios,
    vista,
    setVista,
    crearEstudio,
    eliminarEstudioVM,
    refetchEstudios,
  };
};
