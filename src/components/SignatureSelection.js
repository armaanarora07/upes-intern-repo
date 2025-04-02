import React from "react";
import Signature from "./Signature";
import Stamp from "./Stamp";
import { toggleSwitch } from "../slices/toggleSlice";
import { useSelector, useDispatch } from "react-redux";

function SignatureSelection() {
  const enabled = useSelector((state) => state.toggle.enabled);
  const dispatch = useDispatch();

  const handleSelection = (selection) => {
    if ((selection === "stamp" && !enabled) || (selection === "signature" && enabled)) {
      dispatch(toggleSwitch());
    }
  };

  return (
    <div className="p-6 mt-5 mb-6 bg-white border rounded-lg shadow-xl border-gray-200 flex flex-col items-center sm:flex-row sm:justify-between gap-3 dark:bg-gray-800 dark:border-gray-700">
      {/* Left Section - Signature/Stamp */}
      {enabled ? <Stamp /> : <Signature />}

      {/* Segmented Button UI */}
      <div className="flex items-center space-x-2 bg-gray-200 p-1 rounded-lg dark:bg-gray-600 dark:border-gray-700">
        <button
          className={`px-4 py-2 rounded-lg text-sm font-medium transition dark:text-gray-200 ${
            !enabled ? "bg-blue-500 text-white dark:bg-blue-800 dark:hover:bg-blue-700" : "bg-transparent text-gray-700"
          }`}
          onClick={() => handleSelection("signature")}
        >
          Signature
        </button>
        <button
          className={`px-4 py-2 rounded-md text-sm font-medium transition dark:text-gray-200 ${
            enabled ? "bg-blue-500 text-white dark:bg-blue-800 dark:hover:bg-blue-700" : "bg-transparent text-gray-700"
          }`}
          onClick={() => handleSelection("stamp")}
        >
          Stamp
        </button>
      </div>
    </div>
  );
}

export default SignatureSelection;
