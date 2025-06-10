import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  addDoc,
  Timestamp,
  deleteDoc,
} from "firebase/firestore";
import {
  ref,
  listAll,
  getDownloadURL,
  deleteObject,
  uploadBytesResumable,
} from "firebase/storage";
import { FileItem } from "../../models/File";
import { auth, db, storage } from "../../config/firebase";

export const FileDAO = {
  async getCurrentUser() {
    return new Promise((resolve) =>
      auth.onAuthStateChanged((user) => resolve(user)),
    );
  },

  async getUserData(uid: string) {
    const userDoc = await getDoc(doc(db, "hcc_ai_users", uid));
    return userDoc.exists() ? userDoc.data() : null;
  },

  async listFiles(folder: string): Promise<FileItem[]> {
    const folderRef = ref(storage, folder);

    try {
      const res = await listAll(folderRef);
      return await Promise.all(
        res.items.map(async (item) => {
          const url = await getDownloadURL(item);
          return { name: item.name, url };
        }),
      );
    } catch (error) {
      console.error("Error listando archivos:", error);
      return [];
    }
  },

  async deleteFile(folderPath: string, fileName: string) {
    const fileRef = ref(storage, `${folderPath}${fileName}`);
    await deleteObject(fileRef);
  },

  async uploadFile(
    folderPath: string,
    file: File,
    onSuccess?: () => void,
    onError?: (error: any) => void,
  ) {
    const storageRef = ref(storage, `${folderPath}${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on("state_changed", null, onError, async () => {
      onSuccess?.();
    });
  },

  async getImageInfoByUrl(imageUrl: string) {
    const q = query(
      collection(db, "hcc_ai_images"),
      where("url", "==", imageUrl),
    );
    const snapshot = await getDocs(q);
    return !snapshot.empty ? snapshot.docs[0].data() : null;
  },

  async getDocumentInfoByUrl(pdfUrl: string) {
    const q = query(
      collection(db, "hcc_ai_documents"),
      where("url", "==", pdfUrl),
    );
    const snapshot = await getDocs(q);
    return !snapshot.empty ? snapshot.docs[0].data() : null;
  },

  async uploadPdfReport({
    pdfBlob,
    folderPath,
    fileName,
    studyId,
  }: {
    pdfBlob: Blob;
    folderPath: string;
    fileName: string;
    studyId: string;
  }): Promise<string> {
    try {
      const pdfRef = ref(storage, `${folderPath}/${fileName}`);
      await uploadBytesResumable(pdfRef, pdfBlob);

      const downloadURL = await getDownloadURL(pdfRef);

      await updateDoc(doc(db, "hcc_ai_studies", studyId), {
        pdfReportUrl: downloadURL,
      });

      return downloadURL;
    } catch (error) {
      console.error("Error al subir y guardar el PDF:", error);
      throw error;
    }
  },

  async saveDocumentRecord({
    pdfUrl,
    estudioId,
    pacienteId,
    doctorId,
  }: {
    pdfUrl: string;
    estudioId: string;
    pacienteId: string;
    doctorId: string;
  }) {
    try {
      await addDoc(collection(db, "hcc_ai_documents"), {
        fechaCreacion: Timestamp.now(),
        url: pdfUrl,
        estudioId,
        pacienteId,
        doctorId,
      });

      console.log("Documento guardado en hcc_ai_documents");
    } catch (error) {
      console.error("Error al guardar documento:", error);
      throw error;
    }
  },
  async uploadStudyImage({
    file,
    fileName,
    tipo,
    userId,
    folderPath,
    studyId,
    predictionId = null,
  }: {
    file: File;
    fileName: string;
    tipo: "ecografias" | "mask";
    userId: string;
    folderPath: string;
    studyId: string;
    predictionId?: string | null;
  }): Promise<string> {
    const storageRef = ref(storage, `${folderPath}/${tipo}/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        null,
        (error) => reject(error),
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

            const sizeKB = Math.round(uploadTask.snapshot.totalBytes / 1024);

            await addDoc(collection(db, "hcc_ai_images"), {
              url: downloadURL,
              fechaSubida: Timestamp.now(),
              estudioId: studyId,
              subidoPorDoctorId: userId,
              resolucion: "128x128",
              pesoKB: sizeKB,
              asociadaAPrediccionId: predictionId,
              tipo: "original",
            });

            const studyRef = doc(db, "hcc_ai_studies", studyId);
            if (tipo === "ecografias") {
              await updateDoc(studyRef, { imagenUrl: downloadURL });
            } else if (tipo === "mask") {
              await updateDoc(studyRef, { maskUrl: downloadURL });
            }

            resolve(downloadURL);
          } catch (err) {
            reject(err);
          }
        },
      );
    });
  },

  async deleteStudyImage({
    imageUrl,
    userId,
    folderPath,
    studyId,
  }: {
    imageUrl: string;
    userId: string;
    folderPath: string;
    studyId: string;
  }) {
    void userId;
    try {
      const fileName = decodeURIComponent(
        imageUrl.split("%2F").pop()?.split("?")[0] || "",
      );

      const storageRef = ref(storage, `${folderPath}/ecografias/${fileName}`);
      console.log("Eliminando imagen de Firebase Storage:", imageUrl);
      await deleteObject(storageRef);

      // Eliminar referencia en estudio
      await updateDoc(doc(db, "hcc_ai_studies", studyId), {
        imagenUrl: null,
      });

      // Borrar entrada en hcc_ai_images
      const q = query(
        collection(db, "hcc_ai_images"),
        where("url", "==", imageUrl),
      );
      const snapshot = await getDocs(q);
      for (const docSnap of snapshot.docs) {
        await deleteDoc(doc(db, "hcc_ai_images", docSnap.id));
      }

      return true;
    } catch (error) {
      console.error("Error al eliminar imagen:", error);
      throw error;
    }
  },

  async updateImageWithPrediction({
    imageUrl,
    predictionId,
    predictedClass,
    model,
  }: {
    imageUrl: string;
    predictionId: string;
    predictedClass: number;
    model: string;
  }): Promise<void> {
    const q = query(
      collection(db, "hcc_ai_images"),
      where("url", "==", imageUrl),
    );
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const docRef = doc(db, "hcc_ai_images", snapshot.docs[0].id);

      const claseTexto =
        model === "HCC-AI"
          ? (["Sano", "Esteatosis", "Cirrosis", "Hepatocarcinoma"][
              predictedClass
            ] ?? "Desconocido")
          : `F${predictedClass}`;

      await updateDoc(docRef, {
        clasePredicha: claseTexto,
        idPrediccion: predictionId,
      });

      console.log(
        "Imagen actualizada con clase y ID de predicción:",
        claseTexto,
      );
    } else {
      console.warn(
        "No se encontró documento en hcc_ai_images para esa imagen.",
      );
    }
  },

  async uploadMaskImage(
    fileBlob: Blob,
    folderPath: string,
    fileName: string,
  ): Promise<string> {
    const storageRef = ref(storage, `${folderPath}/masks/${fileName}`);
    await uploadBytesResumable(storageRef, fileBlob);
    return await getDownloadURL(storageRef);
  },

  async saveMaskMetadata({
    imageUrl,
    estudioId,
    doctorId,
    predictionId,
    sizeKB,
    predictedClass,
  }: {
    imageUrl: string;
    estudioId: string;
    doctorId: string;
    predictionId: string;
    sizeKB: number;
    predictedClass: number;
  }) {
    return await addDoc(collection(db, "hcc_ai_images"), {
      url: imageUrl,
      fechaSubida: Timestamp.now(),
      estudioId,
      subidoPorDoctorId: doctorId,
      resolucion: "128x128",
      pesoKB: sizeKB,
      asociadaAPrediccionId: predictionId,
      clasePredicha: predictedClass,
      idPrediccion: predictionId,
      tipo: "mask",
    });
  },
};
