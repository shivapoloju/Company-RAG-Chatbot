import { useState } from "react";
import { FiUploadCloud, FiFile, FiCheckCircle } from "react-icons/fi";
import api from "../services/api";
import toast from "react-hot-toast";

const UploadCard = ({ chatId, onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === "application/pdf") {
        setFile(droppedFile);
      } else {
        toast.error("Only PDF files are supported");
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const upload = async () => {
    if (!file) {
      toast.error("Please choose or drag a PDF first");
      return;
    }

    try {
      setLoading(true);
      const form = new FormData();
      form.append("document", file);
      if (chatId) {
        form.append("chatId", chatId);
      }

      await api.post("/documents/upload", form);

      toast.success("Document indexed successfully!");
      setFile(null);
      
      const fileInput = document.querySelector("input[type=file]");
      if (fileInput) fileInput.value = "";
      if (onUploadSuccess) onUploadSuccess();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Upload and ingestion failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden transition-all duration-300 hover:border-slate-700/80">
      
      <h2 className="text-lg font-bold font-heading mb-4 text-slate-100 flex items-center gap-2">
        <span>📄</span> Upload Document
      </h2>

      {/* Drag & Drop Zone */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${
          dragActive 
            ? "border-indigo-500 bg-indigo-500/5" 
            : file 
            ? "border-emerald-500/50 bg-emerald-500/5" 
            : "border-slate-800 hover:border-slate-700 bg-slate-950/20"
        }`}
        onClick={() => document.querySelector("input[type=file]").click()}
      >
        <input
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={handleFileChange}
        />

        {file ? (
          <div className="flex flex-col items-center text-center">
            <FiCheckCircle className="text-3xl text-emerald-400 mb-3 animate-pulse" />
            <p className="text-sm font-semibold text-slate-200 max-w-[200px] truncate">
              {file.name}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              {(file.size / (1024 * 1024)).toFixed(2)} MB • Ready to Index
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center">
            <FiUploadCloud className="text-3xl text-indigo-400 mb-3" />
            <p className="text-sm text-slate-300 font-medium">
              Drag & drop document PDF
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              or click to browse from files
            </p>
          </div>
        )}
      </div>

      {file && (
        <button
          onClick={upload}
          disabled={loading}
          className="w-full mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-indigo-600/10 active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Processing AI Embeddings...</span>
            </>
          ) : (
            <span>Start Indexing</span>
          )}
        </button>
      )}

      {/* Info Badge */}
      <div className="mt-4 bg-slate-950/30 rounded-lg p-3 border border-slate-900 flex gap-2.5 items-start">
        <span className="text-sm">💡</span>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Uploaded files will be processed, chunked, and embedded into the vector space for real-time document lookup.
        </p>
      </div>

    </div>
  );
};

export default UploadCard;