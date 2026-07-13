import { useState, useRef, useEffect } from "react";
import { FiSend } from "react-icons/fi";
import Loader from "./Loader";
import Message from "./Message";

const ChatBox = ({ messages, onSendMessage, loading, documents = [] }) => {
  const [question, setQuestion] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  const sendQuestion = () => {
    if (!question.trim() || loading || documents.length === 0) return;
    onSendMessage(question);
    setQuestion("");
  };

  const handleEnter = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendQuestion();
    }
  };

  const hasDocs = documents.length > 0;

  return (
    <div className="flex flex-col h-full bg-[#111827] border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
      
      {/* Top Header */}
      <div className="px-6 py-4 border-b border-slate-800/80 bg-slate-900/40 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-100 font-heading">
            AI Assistant Chat
          </h2>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Answers are grounded in uploaded knowledge base documents.
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${hasDocs ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`}></span>
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            {hasDocs ? "Gemini RAG Active" : "Upload Document"}
          </span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-6 bg-slate-950/20 space-y-4">
        {!hasDocs ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 max-w-md mx-auto">
            <span className="text-4xl mb-4">⚠️</span>
            <h3 className="text-base font-bold text-amber-400 font-heading mb-1.5">
              Document Upload Required
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every chat session requires its own reference document. Please upload a PDF document on the right to start this conversation.
            </p>
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 max-w-md mx-auto">
            <span className="text-4xl mb-4">💬</span>
            <h3 className="text-base font-bold text-slate-200 font-heading mb-1.5">
              Knowledge Base Active
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Ask any question regarding the uploaded document(s), and the AI will answer using the parsed text content.
            </p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <Message key={index} message={msg} />
          ))
        )}

        {loading && <Loader />}

        <div ref={bottomRef} />
      </div>

      {/* Input Form Box */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-900/20">
        <div className={`flex items-center gap-3 bg-slate-900/60 border rounded-xl p-2 transition-all duration-200 ${
          !hasDocs 
            ? "border-slate-800 opacity-60 cursor-not-allowed" 
            : "border-slate-800 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/10"
        }`}>
          <input
            className="flex-1 bg-transparent border-none text-sm text-slate-200 outline-none placeholder-slate-500 px-3 py-2 disabled:cursor-not-allowed"
            placeholder={
              !hasDocs 
                ? "Please upload a document to unlock chat..." 
                : loading 
                ? "Generating response..." 
                : "Type your question..."
            }
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleEnter}
            disabled={loading || !hasDocs}
          />

          <button
            onClick={sendQuestion}
            disabled={!question.trim() || loading || !hasDocs}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800/80 text-white disabled:text-slate-500 p-2.5 rounded-lg active:scale-95 transition-all duration-150 flex items-center justify-center disabled:cursor-not-allowed"
            title="Send Message"
          >
            <FiSend className="text-base" />
          </button>
        </div>
      </div>

    </div>
  );
};

export default ChatBox;