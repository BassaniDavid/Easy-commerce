// DarkModeToggle.jsx
import { useEffect, useState } from "react";

export default function DarkModeToggle() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  // aggiunge o rimuove classe dark per attivare o disattivare la darkmode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  return (
    // toggle darkmode
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={darkMode}
        onChange={() => setDarkMode(!darkMode)}
      />
      <div
        className="w-12 h-6 rounded-full bg-gray-200 overflow-hidden relative peer transition-colors duration-500
          before:flex before:items-center before:justify-center before:text-xs
          before:content-['☀️'] before:absolute before:h-5 before:w-5 before:top-1/2 before:left-1 before:-translate-y-1/2 before:bg-white before:rounded-full
          before:transition-all before:duration-700 peer-checked:before:opacity-0 peer-checked:before:rotate-90 peer-checked:before:-translate-y-full
          after:flex after:items-center after:justify-center after:text-xs
          after:content-['🌑'] after:absolute after:h-5 after:w-5 after:right-1
          after:top-1/2 after:translate-y-full after:opacity-0 after:transition-all after:duration-700
          peer-checked:after:translate-y-[-50%] peer-checked:after:opacity-100 peer-checked:after:rotate-180
          peer-checked:bg-[#383838]"
      ></div>
    </label>
  );
}
