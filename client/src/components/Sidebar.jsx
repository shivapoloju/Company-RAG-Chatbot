import { FiPlus, FiMessageSquare, FiTrash2 } from "react-icons/fi";

const Sidebar = ({
  sessions,
  activeSessionId,
  onSelectSession,
  onDeleteSession,
  onCreateSession,
  loading,
}) => {
  return (
    <aside className="w-80 bg-[#0e1322] border-r border-slate-800/80 flex flex-col h-[calc(100vh-73px)] shrink-0">
      
      {/* Action Header */}
      <div className="p-4">
        <button
          onClick={onCreateSession}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600/10 hover:bg-indigo-600 border border-indigo-500/30 hover:border-indigo-500 text-indigo-400 hover:text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed group active:scale-[0.98]"
        >
          <FiPlus className="text-lg transition-transform duration-200 group-hover:rotate-90" />
          <span>New Chat</span>
        </button>
      </div>

      {/* Sessions List */}
      <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-1">
        <p className="text-[11px] uppercase tracking-wider font-bold text-slate-500 px-3 mb-2">
          Chat History
        </p>

        {sessions.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-sm text-slate-500 leading-normal">
              No past conversations found. Click above to start a new chat.
            </p>
          </div>
        ) : (
          sessions.map((session) => {
            const isActive = session._id === activeSessionId;
            return (
              <div
                key={session._id}
                className={`group flex items-center justify-between px-3 py-3 rounded-xl cursor-pointer transition-all duration-150 relative ${
                  isActive
                    ? "bg-indigo-600/20 text-indigo-200 border border-indigo-500/20"
                    : "hover:bg-slate-900 text-slate-400 hover:text-slate-200 border border-transparent"
                }`}
                onClick={() => onSelectSession(session._id)}
              >
                <div className="flex items-center gap-2.5 overflow-hidden w-[82%]">
                  <FiMessageSquare className={`text-base shrink-0 ${isActive ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-400"}`} />
                  <span className="text-sm font-medium truncate">
                    {session.title || "Untitled Chat"}
                  </span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteSession(session._id);
                  }}
                  className="opacity-0 group-hover:opacity-100 hover:text-red-400 p-1 text-slate-500 hover:bg-slate-800 rounded transition-all duration-150 shrink-0"
                  title="Delete Session"
                >
                  <FiTrash2 className="text-sm" />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Branding */}
      <div className="p-4 border-t border-slate-900 bg-slate-950/20 text-center">
        <p className="text-[10px] text-slate-600 font-medium">
          Company RAG Chatbot v1.1.0
        </p>
      </div>

    </aside>
  );
};

export default Sidebar;
