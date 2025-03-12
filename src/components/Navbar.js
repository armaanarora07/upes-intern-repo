import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../slices/themeSlice.js";

const Navbar = () => {
  const { title } = useSelector((state) => state.navbar);
  const theme = useSelector((state) => state.theme.theme);
  const dispatch = useDispatch();

  return (
    <nav
      className="bg-[#F9FAFC] dark:bg-gray-800 bg-opacity-60 backdrop-blur-md h-16 flex items-center justify-between px-6 shadow-xl fixed top-0 right-0 z-10"
      style={{ left: "var(--sidebar-width, 16rem)" }}
    >
      <h1 className="text-[#4154f1] dark:text-white font-bold text-3xl">
        {title}
      </h1>

      {/* Dark Mode Toggle Button */}
      {/*
      <button
        onClick={() => dispatch(toggleTheme())}
        className="p-2 rounded-md border dark:bg-gray-700 dark:text-white bg-gray-200 text-black"
      >
        {theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>
      */}
    </nav>
  );
};

export default Navbar;
