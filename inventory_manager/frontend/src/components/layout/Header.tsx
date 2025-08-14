import { useAuth } from "../../hooks/useAuth";

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-gray-900 text-white flex justify-between items-center px-6 py-4 shadow-md">
      <div className="text-2xl font-extrabold tracking-wide">Dashboard</div>
      {user && (
        <button
          onClick={logout}
          className="text-lg font-medium hover:text-blue-400 transition-colors duration-200 focus:outline-none"
        >
          Logout
        </button>
      )}
    </header>
  );
};

export default Header;
