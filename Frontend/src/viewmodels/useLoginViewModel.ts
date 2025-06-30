// src/viewmodels/useLoginViewModel.ts

import { useState } from "react";
import { FirebaseError } from "firebase/app";
import { useNavigate } from "react-router-dom";
import { AuthDAO } from "../data/dao/AuthDAO";

export function useLoginViewModel() {
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
      const userCredential = await AuthDAO.login(email, password);
      const user = userCredential.user;

      if (user.emailVerified) {
        navigate("/dashboard");
        setTransitioning(true);

        try {
          await Promise.all([
            fetch(import.meta.env.VITE_BACKEND_URL + "/", { method: "GET" }),
            fetch(import.meta.env.VITE_AI_BACKEND_URL + "/", { method: "GET" }),
          ]);
        } catch (err) {}
      } else {
        await AuthDAO.logout();
        setError("Debes verificar tu correo antes de acceder.");
      }
    } catch (error: any) {
      if (error.code === "auth/invalid-credential") {
        setError("Los datos introducidos no fueron correctos.");
      } else if (error.code === "auth/invalid-email") {
        setError("El correo electrónico introducido no es válido.");
      } else if (error.code === "auth/missing-password") {
        setError("Debe ingresar su contraseña para iniciar sesión.");
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
      await AuthDAO.sendResetEmail(resetEmail);
      setSuccessMessage(
        "Se ha enviado un correo para restablecer tu contraseña.",
      );
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
    handlePasswordReset,
  };
}
