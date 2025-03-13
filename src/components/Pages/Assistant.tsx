import { useState } from "react";
import { marked } from "marked";  // Importar la librería 'marked'

const Assistant = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendQuestion = async () => {
    if (!question.trim()) return;

    setIsLoading(true);  // Inicia el *loading*

    try {
      const response = await fetch("http://localhost:8000/assistant/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      const data = await response.json();
      setAnswer(data.answer);
    } catch (error) {
      setAnswer("Error al comunicarse con la IA.");
    } finally {
      setIsLoading(false);  // Detiene el *loading*
    }
  };

  return (
    <div className="p-6 bg-gray-800 text-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">🧠 Asistente de IA</h2>
      <textarea
        className="w-full p-2 bg-gray-700 text-white rounded"
        rows={4}
        placeholder="Escribe tu pregunta..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <button
        onClick={sendQuestion}
        className="mt-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
      >
        Preguntar
      </button>
      {isLoading ? (
        <div className="mt-4 p-3 bg-gray-900 rounded">Cargando...</div>
      ) : (
        answer && (
          <div
            className="mt-4 p-3 bg-gray-900 rounded"
            dangerouslySetInnerHTML={{ __html: marked(answer) }} // Aquí es donde se aplica el formato
          />
        )
      )}
    </div>
  );
};

export default Assistant;
