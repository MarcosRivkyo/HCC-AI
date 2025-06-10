import {
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { updateProfile, User } from "firebase/auth";
import { db, storage } from "../../config/firebase";

export const UserDAO = {
  async createUser(uid: string, userData: any) {
    return await setDoc(doc(db, "hcc_ai_users", uid), {
      ...userData,
      createdAt: serverTimestamp(),
    });
  },

  async getUserRole(uid: string): Promise<string | null> {
    const docRef = doc(db, "hcc_ai_users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return data.rol || null;
    }
    return null;
  },

  async getUserById(uid: string) {
    const userDoc = await getDoc(doc(db, "hcc_ai_users", uid));
    return userDoc.exists() ? userDoc.data() : null;
  },

  async updateUserProfile(user: User, data: any, image?: File) {
    let photoURL = data.profilePicture;

    if (image) {
      const folder = data.imageFolder || `HCC-AI/users/${user.uid}`;
      const storageRef = ref(storage, `${folder}/profile_pictures/${user.uid}`);
      await uploadBytes(storageRef, image);
      photoURL = await getDownloadURL(storageRef);
    }

    await updateProfile(user, {
      displayName: data.displayName,
      photoURL,
    });

    await updateDoc(doc(db, "hcc_ai_users", user.uid), {
      ...data,
      profilePicture: photoURL,
    });

    return photoURL;
  },

  async getUserLinks(uid: string): Promise<any[] | null> {
    const docRef = doc(db, "hcc_ai_users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return data.useful_links || null;
    }
    return null;
  },

  async updateUserLinks(uid: string, links: any[]): Promise<void> {
    const docRef = doc(db, "hcc_ai_users", uid);
    await updateDoc(docRef, { useful_links: links });
  },

  async getAllDoctors(excludeUid?: string): Promise<any[]> {
    try {
      const querySnapshot = await getDocs(collection(db, "hcc_ai_users"));

      return querySnapshot.docs
        .map((doc) => ({ id: doc.id, ...(doc.data() as any) }))
        .filter(
          (u) =>
            (u.rol === "Médico" || u.rol === "Administrador") &&
            u.id !== excludeUid,
        );
    } catch (error) {
      console.error("Error al obtener los médicos:", error);
      return [];
    }
  },
};
