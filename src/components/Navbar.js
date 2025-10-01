import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../slices/themeSlice.js";
import { Moon, Sun } from "lucide-react";

const Navbar = () => {
  const { title } = useSelector((state) => state.navbar);
  const theme = useSelector((state) => state.theme.theme);
  const dispatch = useDispatch();

  const isHelp = title && title.toLowerCase().includes('help');

  return (
    <nav
      className={`bg-[#F9FAFC] dark:bg-gray-800 ${isHelp ? 'bg-opacity-95' : 'bg-opacity-60'} backdrop-blur-md h-16 flex items-center justify-between px-6 shadow-xl fixed top-0 right-0 z-10`}
      style={{ left: "var(--sidebar-width, 16rem)" }}
    >
      <h1 className="text-[#4154f1] dark:text-white font-bold text-3xl">
        {title}
      </h1>

      {/* Dark Mode Toggle Button */}
      
      <button
        onClick={() => dispatch(toggleTheme())}
        className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-400 dark:bg-gray-600 shadow-md transition-all duration-300 hover:scale-105 active:scale-95"
      >
        {theme === "dark" ? (
          <Sun className="w-6 h-6 text-white" />
        ) : (
          <Moon className="w-6 h-6 text-gray-800" />
        )}

      </button>

      
    </nav>
  );
};

export default Navbar;
