import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { ModelData } from "../../models/AiModels";
import { auth, db } from "../../config/firebase";

export const ModelsDAO = {
  async getCurrentUser() {
    return new Promise((resolve) =>
      auth.onAuthStateChanged((user) => resolve(user)),
    );
  },

  async getUserData(uid: string) {
    const userDoc = await getDoc(doc(db, "hcc_ai_users", uid));
    return userDoc.exists() ? userDoc.data() : null;
  },

  async listModels(): Promise<ModelData[]> {
    const snapshot = await getDocs(collection(db, "hcc_ai_models"));
    const modelsFromDb = snapshot.docs.map((doc) => {
      const data = doc.data() as ModelData;
      return {
        ...data,
        modelId: data.modelId?.trim(),
        modelType: data.modelType?.trim(),
        modelName: data.modelName?.trim(),
        description: data.description?.trim(),
      };
    });

    const geminiModel: ModelData = {
      modelId: "gemini-1.5-pro",
      modelName: "Gemini 1.5 Pro",
      modelType: "Generative",
      accuracy: NaN,
      description:
        "Modelo generativo diseñado para enriquecer los resultados médicos, facilitando su comprensión y aportando información adicional.",
      trainDate: null,
    };

    return [...modelsFromDb, geminiModel];
  },
};
