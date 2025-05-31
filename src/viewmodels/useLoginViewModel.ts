import { useState } from "react";
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail, signOut } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { useNavigate } from "react-router-dom";
import { auth } from "../config/firebase";

export function useLoginViewModel() {
  const authInstance = getAuth();
  const navigate = useNavigate();

  const [authing, setAuthing] = useState(false);
  const [email, setEmail] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showResetInput, setShowResetInput] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [transitioning, setTransitioning] = useState(false);

  const signInWithEmail = async () => {
    setAuthing(true);
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(authInstance, email, password);
      const user = userCredential.user;

      if (user.emailVerified) {
        setTransitioning(true);
        navigate("/dashboard");
      } else {
        await signOut(authInstance);
        setError("Debes verificar tu correo antes de acceder.");
      }
    } catch (error: any) {
      if (error.code === "auth/invalid-credential") {
        setError("Los datos introducidos no fueron correctos.");
      } else {
        setError(error.message);
      }
    } finally {
      setAuthing(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!resetEmail) {
      setError("Por favor, introduce tu email para restablecer la contraseña.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setSuccessMessage("Se ha enviado un correo para restablecer tu contraseña.");
    } catch (error) {
      if ((error as FirebaseError).code === "auth/user-not-found") {
        setError("No hay una cuenta registrada con ese correo.");
      } else {
        setError((error as FirebaseError).message);
      }
    }
  };

  return {
    authing,
    email,
    password,
    resetEmail,
    error,
    successMessage,
    showResetInput,
    showPassword,
    transitioning,
    setEmail,
    setPassword,
    setResetEmail,
    setShowResetInput,
    setShowPassword,
    setTransitioning,
    signInWithEmail,
    handlePasswordReset
  };
}
