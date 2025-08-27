import { useAuth } from "../../hooks/useAuth";
import { LogOut } from "lucide-react";

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-gray-900 text-white flex justify-between items-center px-6 py-4 shadow-md">
      <div className="text-2xl font-extrabold tracking-wide">
        Inventory Manager
      </div>
      {user && (
        <button
          onClick={logout}
          className="p-2 rounded hover:bg-gray-800 transition-colors duration-200 focus:outline-none"
          title="Logout"
        >
          <LogOut className="w-6 h-6 text-white hover:text-blue-400" />
        </button>
      )}
    </header>
  );
};

export default Header;
