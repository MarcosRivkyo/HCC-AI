// src/data/dao/StudyDAO.ts
import {
  getDocs,
  getDoc,
  addDoc,
  deleteDoc,
  collection,
  doc,
  query,
  where,
  orderBy,
  Timestamp,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { Study } from "../../models/Studies";

type Estudio = {
  studieName: string;
  status: string;
  studieDate: any;
  doctorName: string;
  patientName: string;
  clinicalDescription?: string;
  imagenUrl?: string | null;
  pdfReportUrl?: string | null;
  predictionId?: string;
  doctorId?: string;
  patientId?: string;
  sharedWithDoctorIds?: string[];
};

type Prediction = {
  maskUrl?: string;
  predicted_class: number;
  probabilities: number[];
  classificationModel?: string;
  classificationSubModel?: string;
  segmentationModel?: string;
  segmentationSubModel?: string;
  confidenceThreshold?: number;
  explanation?: string;
};

export const StudyDAO = {
  async getUserStudies(uid: string) {
    const q = query(
      collection(db, "hcc_ai_studies"),
      orderBy("studieDate", "desc"),
    );
    const snapshot = await getDocs(q);

    return snapshot.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .filter(
        (study: any) =>
          study.doctorId === uid ||
          (Array.isArray(study.sharedWithDoctorIds) &&
            study.sharedWithDoctorIds.includes(uid)),
      ) as Study[];
  },

  async createStudy(
    userId: string,
    userData: any,
    studyData: any,
  ): Promise<string> {
    const existingQuery = query(
      collection(db, "hcc_ai_studies"),
      where("studieName", "==", studyData.studieName),
      where("doctorId", "==", userId),
    );
    const snapshot = await getDocs(existingQuery);
    if (!snapshot.empty) throw new Error("Ya existe un estudio con ese nombre");

    const date = new Date(studyData.studieDate);
    date.setHours(12);
    const studieDate = Timestamp.fromDate(date);

    const ref = await addDoc(collection(db, "hcc_ai_studies"), {
      ...studyData,
      studieDate,
      doctorId: userId,
      doctorName:
        userData?.firstName || userData?.displayName || userData?.email,
    });

    return ref.id;
  },

  async deleteStudyWithPrediction(id: string): Promise<void> {
    const studyRef = doc(db, "hcc_ai_studies", id);
    const snapshot = await getDoc(studyRef);
    if (!snapshot.exists()) throw new Error("El estudio no existe");

    const data = snapshot.data();
    if (data.predictionId) {
      try {
        await deleteDoc(doc(db, "hcc_ai_predictions", data.predictionId));
      } catch (e) {
        console.warn("No se pudo borrar la predicción asociada:", e);
      }
    }

    await deleteDoc(studyRef);
  },

  async getFilteredStudies(
    uid: string,
    vista: "mios" | "compartidos" | "todos",
  ) {
    const q = query(
      collection(db, "hcc_ai_studies"),
      orderBy("studieDate", "desc"),
    );
    const snapshot = await getDocs(q);

    return snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((estudio: any) => {
        if (vista === "mios") return estudio.doctorId === uid;
        if (vista === "compartidos")
          return estudio.sharedWithDoctorIds?.includes(uid);
        return (
          estudio.doctorId === uid || estudio.sharedWithDoctorIds?.includes(uid)
        );
      }) as Study[];
  },

  async getStudiesByPatientId(uid: string): Promise<Study[]> {
    const q = query(
      collection(db, "hcc_ai_studies"),
      where("patientId", "==", uid),
      orderBy("studieDate", "desc"),
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Study[];
  },

  async getDoctorStudies(uid: string): Promise<Study[]> {
    const q = query(
      collection(db, "hcc_ai_studies"),
      where("doctorId", "==", uid),
      orderBy("studieDate", "desc"),
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Study[];
  },

  async fetchEstudioDetalle(id: string): Promise<Study | null> {
    try {
      const docRef = doc(db, "hcc_ai_studies", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Study;
      } else {
        console.warn("Estudio no encontrado");
        return null;
      }
    } catch (error) {
      console.error("Error al obtener estudio:", error);
      return null;
    }
  },

  async fetchPrediction(predictionId: string): Promise<Prediction | null> {
    try {
      const predictionRef = doc(db, "hcc_ai_predictions", predictionId);
      const predictionSnap = await getDoc(predictionRef);

      if (predictionSnap.exists()) {
        return predictionSnap.data() as Prediction;
      } else {
        console.warn("Predicción no encontrada");
        return null;
      }
    } catch (error) {
      console.error("Error al obtener predicción:", error);
      return null;
    }
  },

  async updateStudy(id: string, data: Partial<Estudio>): Promise<void> {
    const ref = doc(db, "hcc_ai_studies", id);
    console.log();
    let parsedDate: Timestamp | undefined = undefined;

    if (data.studieDate) {
      const temp = new Date(data.studieDate);
      if (!isNaN(temp.getTime())) {
        parsedDate = Timestamp.fromDate(temp);
      } else {
        throw new Error("Fecha de estudio inválida");
      }
    }

    await updateDoc(ref, {
      ...data,
      studieDate: parsedDate,
    });
  },

  async isStudyNameDuplicate(
    name: string,
    excludeId?: string,
  ): Promise<boolean> {
    const snapshot = await getDocs(collection(db, "hcc_ai_studies"));
    return snapshot.docs.some((doc) => {
      const data = doc.data();
      return (
        data.studieName?.toLowerCase() === name.toLowerCase() &&
        doc.id !== excludeId
      );
    });
  },
  async shareStudyWithDoctor(studyId: string, doctorId: string): Promise<void> {
    const estudioRef = doc(db, "hcc_ai_studies", studyId);
    await updateDoc(estudioRef, {
      sharedWithDoctorIds: arrayUnion(doctorId),
    });
  },

  async savePrediction(data: any): Promise<string> {
    const ref = await addDoc(collection(db, "hcc_ai_predictions"), {
      ...data,
      createdAt: Timestamp.now(),
    });
    return ref.id;
  },

  async linkPredictionToStudy(
    studyId: string,
    predictionId: string,
  ): Promise<void> {
    const docRef = doc(db, "hcc_ai_studies", studyId);
    await updateDoc(docRef, {
      predictionId,
      status: "Finalizado",
    });
  },
};
