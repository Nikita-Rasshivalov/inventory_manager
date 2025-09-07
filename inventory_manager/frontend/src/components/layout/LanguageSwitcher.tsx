import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: "en" | "fr") => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="absolute  bottom-2 right-4 flex gap-2 z-50">
      <div className="flex gap-2">
        <button
          onClick={() => changeLanguage("en")}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors shadow-md
          ${
            i18n.language === "en"
              ? "bg-blue-500 text-white"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
        >
          EN
        </button>
        <button
          onClick={() => changeLanguage("fr")}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors shadow-md
          ${
            i18n.language === "fr"
              ? "bg-blue-500 text-white"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
        >
          FR
        </button>
      </div>
    </div>
  );
};

export default LanguageSwitcher;
