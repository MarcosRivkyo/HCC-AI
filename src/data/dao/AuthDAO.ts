import { auth } from "../../config/firebase";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
  onAuthStateChanged,
  User,
} from "firebase/auth";

export const AuthDAO = {
  async login(email: string, password: string) {
    return await signInWithEmailAndPassword(auth, email, password);
  },

  async logout() {
    return await signOut(auth);
  },

  async sendResetEmail(email: string) {
    return await sendPasswordResetEmail(auth, email);
  },

  async registerUser(email: string, password: string) {
    return await createUserWithEmailAndPassword(auth, email, password);
  },

  async sendVerificationEmail(user: any) {
    return await sendEmailVerification(user);
  },

  async updateUserProfile(user: any, userName: string, photoURL: string) {
    return await updateProfile(user, {
      displayName: userName,
      photoURL: photoURL,
    });
  },

  subscribeToAuthChanges(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
  },

  subscribeToAuth(callback: (user: any) => void) {
    return onAuthStateChanged(auth, callback);
  },

  getCurrentUser() {
    return auth.currentUser;
  },
};
