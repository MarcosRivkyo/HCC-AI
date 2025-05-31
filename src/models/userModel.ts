// src/models/userModel.ts
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import { updateProfile, getAuth } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../config/firebase";

const db = getFirestore();
const auth = getAuth();

export const fetchUserData = async (uid: string) => {
  const userDocRef = doc(db, "hcc_ai_users", uid);
  const userDoc = await getDoc(userDocRef);
  return userDoc.exists() ? userDoc.data() : null;
};

export const updateUserProfile = async (
  uid: string,
  data: { firstName: string; lastName: string; phone: string; profilePicture: string; email: string }
) => {
  const userRef = doc(db, "hcc_ai_users", uid);
  await updateDoc(userRef, data);
};

export const uploadProfileImage = async (file: File, path: string) => {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
};

export const updateAuthProfile = async (user: any, displayName: string, photoURL: string) => {
  await updateProfile(user, { displayName, photoURL });
};

export const checkExistingStudy = async (studieName: string, doctorId: string) => {
  const q = query(
    collection(db, "hcc_ai_studies"),
    where("studieName", "==", studieName),
    where("doctorId", "==", doctorId)
  );
  const snapshot = await getDocs(q);
  return !snapshot.empty;
};

export const createStudy = async (data: any) => {
  const finalDate = new Date(data.studieDate);
  finalDate.setHours(0, 0, 0, 0);
  data.studieDate = Timestamp.fromDate(finalDate);

  await addDoc(collection(db, "hcc_ai_studies"), data);
};
