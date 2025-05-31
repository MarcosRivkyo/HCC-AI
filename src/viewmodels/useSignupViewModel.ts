import { useState } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../config/firebase";

export function useSignupViewModel() {
  const navigate = useNavigate();
  const [authing, setAuthing] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [userName, setUserName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [verificationMessage, setVerificationMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const defaultProfilePictureUrl =
    "https://firebasestorage.googleapis.com/v0/b/hcc-ai.firebasestorage.app/o/HCC-AI%2Fpublic%2Fdefault_logo_user.png?alt=media&token=499a8fd4-85dc-49be-8d4a-a469aea1d1f7";

  const defaultUsefulLinks = [
    {
      name: "EASL",
      url: "https://easl.eu/",
      icon: "https://firebasestorage.googleapis.com/v0/b/hcc-ai.firebasestorage.app/o/HCC-AI%2Fpublic%2Flogo_easl.png?alt=media&token=9efaaa87-e6be-44ef-8911-e62a5104db44",
    },
    {
      name: "HRHortega",
      url: "https://www.saludcastillayleon.es/HRHortega/es",
      icon: "https://firebasestorage.googleapis.com/v0/b/hcc-ai.firebasestorage.app/o/HCC-AI%2Fpublic%2Flogo_rhortega.png?alt=media&token=8c388557-614a-4c8f-9419-3eed2157a513",
    },
    {
      name: "HP SCDS",
      url: "https://hpscds.com/",
      icon: "https://firebasestorage.googleapis.com/v0/b/hcc-ai.firebasestorage.app/o/HCC-AI%2Fpublic%2Flogo_hp.jpg?alt=media&token=90a2bd62-565e-4661-993c-36c822d10e1a",
    },
  ];

  const signUpWithEmail = async () => {
    const validCodes = import.meta.env.VITE_ACCESS_CODE;

    if (!validCodes.includes(accessCode.trim())) {
      setError("El código de acceso es inválido.");
      setAuthing(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setAuthing(true);
    setError("");
    setVerificationMessage("");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: userName,
        photoURL: defaultProfilePictureUrl,
      });

      await sendEmailVerification(user);

      await setDoc(doc(db, "hcc_ai_users", user.uid), {
        userName,
        firstName,
        lastName,
        email: user.email,
        phone,
        profilePicture: defaultProfilePictureUrl,
        imageFolder: `HCC-AI/users/${user.uid}/images/`,
        documentFolder: `HCC-AI/users/${user.uid}/documents/`,
        createdAt: serverTimestamp(),
        useful_links: defaultUsefulLinks,
      });

      setUserName("");
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setPassword("");
      setConfirmPassword("");
      setAccessCode("");

      setVerificationMessage("Registro exitoso. Por favor, verifica tu correo electrónico antes de iniciar sesión.");
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        setError("Esta dirección de correo ya está registrada.");
      } else if (error.code === "auth/weak-password") {
        setError("La contraseña debe tener al menos 6 caracteres.");
      } else {
        setError("Hubo un error en el registro. Inténtalo de nuevo.");
      }
    }

    setAuthing(false);
  };

  return {
    authing,
    email,
    password,
    confirmPassword,
    accessCode,
    userName,
    firstName,
    lastName,
    phone,
    error,
    verificationMessage,
    showPassword,
    showConfirmPassword,
    setEmail,
    setPassword,
    setConfirmPassword,
    setAccessCode,
    setUserName,
    setFirstName,
    setLastName,
    setPhone,
    setShowPassword,
    setShowConfirmPassword,
    signUpWithEmail,
  };
}
