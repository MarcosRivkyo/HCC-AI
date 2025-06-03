import { useAssistantViewModel } from "../../viewmodels/AssistantViewModel";
import { useTranslation } from "react-i18next";

const Assistant = () => {
  const {
    question,
    setQuestion,
    chatHistory,
    isLoading,
    sendQuestion,
    chatEndRef,
  } = useAssistantViewModel();

  const { t } = useTranslation("global");

  return (
    <div className="flex flex-col h-full max-h-screen bg-gray-900 text-white">
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3">
        {chatHistory.map((msg, idx) => (
          <div
            key={idx}
            className={`max-w-[75%] p-3 rounded-xl text-sm ${
              msg.type === "user"
                ? "bg-blue-600 self-end text-white"
                : "bg-gray-700 self-start text-white prose prose-invert"
            }`}
            dangerouslySetInnerHTML={{
              __html:
                msg.type === "assistant"
                  ? msg.content
                  : `<p>${msg.content}</p>`,
            }}
          />
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="p-4 border-t border-gray-700 bg-gray-800 flex items-center gap-2">
        <textarea
          className="flex-1 p-2 bg-gray-700 text-white rounded resize-none"
          rows={2}
          placeholder={t("assistant.send_query")}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <button
          onClick={sendQuestion}
          disabled={isLoading}
          className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded text-white flex items-center justify-center w-15 h-10"
        >
          {isLoading ? (
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          ) : (
            t("assistant.send_button")
          )}
        </button>
      </div>
    </div>
  );
};

export default Assistant;
