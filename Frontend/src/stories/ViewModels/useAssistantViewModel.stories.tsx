import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { useAssistantViewModel } from "../../viewmodels/useAssistantViewModel";

/**
 * Componente de demostración para el hook `useAssistantViewModel`.
 * Simula una conversación sencilla entre el usuario y el asistente IA,
 * mostrando preguntas, respuestas y estados de carga.
 */
const AssistantViewModelDemo: React.FC = () => {
  const {
    question,
    setQuestion,
    chatHistory,
    isLoading,
    sendQuestion,
    chatEndRef,
  } = useAssistantViewModel();

  return (
    <div
      style={{
        maxWidth: 600,
        margin: "auto",
        padding: 20,
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2>useAssistantViewModel Demo</h2>

      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: 8,
          height: 300,
          overflowY: "auto",
          padding: 10,
          marginBottom: 10,
          backgroundColor: "#f9f9f9",
        }}
      >
        {chatHistory.map((msg, idx) => (
          <div
            key={idx}
            style={{
              marginBottom: 8,
              textAlign: msg.type === "user" ? "right" : "left",
            }}
            dangerouslySetInnerHTML={{ __html: msg.content }}
          />
        ))}
        <div ref={chatEndRef} />
      </div>

      <textarea
        placeholder="Escribe tu pregunta aquí..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        rows={3}
        style={{
          width: "100%",
          padding: 8,
          marginBottom: 8,
          fontSize: 14,
          borderRadius: 4,
          borderColor: "#ccc",
        }}
        disabled={isLoading}
      />

      <button
        onClick={sendQuestion}
        disabled={isLoading || !question.trim()}
        style={{
          padding: "10px 20px",
          backgroundColor: isLoading || !question.trim() ? "#ccc" : "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: 4,
          cursor: isLoading || !question.trim() ? "default" : "pointer",
        }}
      >
        {isLoading ? "Cargando..." : "Enviar"}
      </button>
    </div>
  );
};

const meta: Meta<typeof AssistantViewModelDemo> = {
  title: "ViewModels/useAssistantViewModel",
  component: AssistantViewModelDemo,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
Viewmodel \`useAssistantViewModel\` que gestiona la lógica del asistente virtual integrado en la plataforma **HCC-AI**.

### Funcionalidad principal:
- Gestiona la pregunta actual del usuario.
- Mantiene el historial de mensajes entre usuario y asistente.
- Envía la pregunta al backend con IA y procesa la respuesta en formato Markdown.
- Controla el estado de carga mientras espera respuesta.
- Realiza scroll automático al último mensaje.

### Notas técnicas:
- La respuesta se procesa con \`marked\` para renderizar Markdown como HTML.
- El viewmodel usa \`fetch\` para comunicación con el backend "HCC_AI_BACKEND" configurado en \`VITE_BACKEND_URL\`.
- Maneja errores de conexión mostrando mensajes adecuados.

### Uso:
Ideal para integrar en interfaces tipo chat o asistentes conversacionales dentro del sistema clínico.

        `,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof AssistantViewModelDemo>;

export const Default: Story = {
  name: "Demo del ViewModel",
};
