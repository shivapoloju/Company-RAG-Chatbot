import { FiFileText, FiUser } from "react-icons/fi";

const Message = ({ message }) => {
  const isUser = message.type === "user";

  if (isUser) {
    return (
      <div className="flex justify-end items-start gap-3">
        <div className="flex flex-col items-end max-w-[80%]">
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white px-4 py-3 rounded-2xl rounded-tr-none shadow-md border border-indigo-500/25">
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
          </div>
          <span className="text-[9px] text-slate-500 mt-1">You</span>
        </div>
        <div className="w-7 h-7 rounded-full bg-indigo-600/10 border border-indigo-500/30 flex items-center justify-center shrink-0">
          <FiUser className="text-xs text-indigo-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start items-start gap-3">
      {/* Bot Icon */}
      <div className="w-7 h-7 rounded-full bg-purple-600/15 border border-purple-500/35 flex items-center justify-center shrink-0">
        <span className="text-xs">🤖</span>
      </div>

      <div className="flex flex-col items-start max-w-[80%]">
        <div className="bg-[#1e293b]/40 backdrop-blur-sm border border-slate-800/80 px-4 py-3.5 rounded-2xl rounded-tl-none shadow-md">
          {/* AI Response Text */}
          <p className="text-sm leading-relaxed text-slate-200 whitespace-pre-wrap font-sans">
            {message.text}
          </p>

          {/* Sources Section */}
          {message.sources && message.sources.length > 0 && (
            <div className="mt-3.5 pt-3 border-t border-slate-800/50">
              <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <FiFileText /> Sources
              </p>
              <div className="flex flex-wrap gap-1.5">
                {message.sources.map((source, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1.5 bg-[#0e1322]/80 border border-slate-800/60 rounded px-2.5 py-1 text-[11px] text-slate-400 font-medium"
                  >
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                    <span className="truncate max-w-[130px] font-heading">{source.file}</span>
                    {source.page !== undefined && (
                      <span className="bg-slate-800 text-[10px] text-slate-300 px-1.5 py-0.2 rounded border border-slate-700">
                        Page {source.page + 1}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <span className="text-[9px] text-slate-500 mt-1">AI Assistant</span>
      </div>
    </div>
  );
};

export default Message;