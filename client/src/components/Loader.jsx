const Loader = () => {
  return (
    <div className="flex justify-start items-center gap-3">
      <div className="w-7 h-7 rounded-full bg-purple-600/15 border border-purple-500/35 flex items-center justify-center shrink-0">
        <span className="text-xs">🤖</span>
      </div>

      <div className="flex items-center gap-1.5 bg-[#1e293b]/20 border border-slate-800/80 px-4 py-3 rounded-2xl rounded-tl-none">
        <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
        <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
        <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
        <span className="text-xs text-slate-500 ml-2 font-medium">Assistant is thinking...</span>
      </div>
    </div>
  );
};

export default Loader;