import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isAdmin = user?.role === "admin";

  return (
    <header className="bg-[#0e1322] border-b border-slate-800/80 sticky top-0 z-40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <span className="text-2xl">🤖</span>
          <h1 className="text-lg font-bold font-heading bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Company Knowledge AI
          </h1>
        </div>

        {/* User profile & Actions */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-sm font-semibold text-slate-200">
              {user?.name || "Guest User"}
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider mt-0.5">
              {isAdmin ? (
                <span className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/25">
                  Admin
                </span>
              ) : (
                <span className="bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700">
                  User
                </span>
              )}
            </span>
          </div>

          <div className="h-8 w-px bg-slate-800"></div>

          <button
            onClick={handleLogout}
            className="text-sm bg-slate-800 hover:bg-red-600/90 text-slate-300 hover:text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 border border-slate-700/50 hover:border-red-600"
          >
            Logout
          </button>
        </div>

      </div>
    </header>
  );
};

export default Navbar;