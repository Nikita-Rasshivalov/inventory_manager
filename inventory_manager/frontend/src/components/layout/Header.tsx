import { useAuth } from "../../hooks/useAuth";
import { LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  return (
    <header className="bg-gray-900 text-white flex justify-between items-center px-4 sm:px-6 py-3 sm:py-4 shadow-md">
      <div className=" text-xl sm:text-2xl font-extrabold tracking-wide truncate">
        Inventory Manager
      </div>
      {user && (
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/profile")}
            className="p-2 rounded hover:bg-gray-800 transition-colors duration-200 focus:outline-none"
            title="Profile"
          >
            <User className="w-5 h-5 sm:w-6 sm:h-6 text-white hover:text-blue-400" />
          </button>

          <button
            onClick={logout}
            className="p-2 rounded hover:bg-gray-800 transition-colors duration-200 focus:outline-none"
            title="Logout"
          >
            <LogOut className="w-5 h-5 sm:w-6 sm:h-6 text-white hover:text-blue-400" />
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
