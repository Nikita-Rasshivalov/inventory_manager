import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";
import { useUserStore } from "../../stores/useUserStore";
const ThemeToggle = () => {
  const { currentUser, updateTheme } = useUserStore();
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    if (currentUser) {
      updateTheme(newTheme);
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
    >
      {theme === "light" ? (
        <Moon className="w-5 h-5" />
      ) : (
        <Sun className="w-5 h-5" />
      )}
    </button>
  );
};

export default ThemeToggle;
