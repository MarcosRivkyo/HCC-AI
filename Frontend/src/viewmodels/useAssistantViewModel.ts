// src/viewmodels/useAssistantViewModel.ts

import { useEffect, useRef, useState } from "react";
import { marked } from "marked";
import { ChatMessage } from "../models/Assistant";

export const useAssistantViewModel = () => {
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const sendQuestion = async () => {
    if (!question.trim()) return;

    setChatHistory((prev) => [...prev, { type: "user", content: question }]);
    setQuestion("");
    setIsLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/ask-assistant/`,

        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            instruction: question,
            input_text: `
            Eres HCC-AI Assistant, un asistente médico experto en enfermedades hepáticas, integrado en la aplicación HCC-AI.
            Debes ayudar al médico a identificar posibles casos de carcinoma hepatocelular (HCC).

            Formato de respuesta requerido:
            - **Resumen clínico** (breve y claro)
            - **Puntos clave**
            - **Consejos médicos relevantes**
            - **Alertas o red flags**, si aplica

            Responde en Markdown para una correcta visualización en formato web.
          `,
          }),
        },
      );

      const data = await response.json();
      const html = await marked.parse(data.respuesta);
      setChatHistory((prev) => [...prev, { type: "assistant", content: html }]);
    } catch (error) {
      setChatHistory((prev) => [
        ...prev,
        { type: "assistant", content: "Error al comunicarse con la IA." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    question,
    setQuestion,
    chatHistory,
    isLoading,
    sendQuestion,
    chatEndRef,
  };
};
