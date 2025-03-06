import React from "react";
import Signature from "./Signature";
import Stamp from "./Stamp";
import { toggleSwitch } from "../slices/toggleSlice";
import { useSelector, useDispatch } from "react-redux";

function SignatureSelection() {
  const enabled = useSelector((state) => state.toggle.enabled);
  const selection = useSelector((state) => state.toggle.selection);
  const dispatch = useDispatch();

  const handleToggle = () => {
    dispatch(toggleSwitch());
  };

  return (
    <div className="p-6 bg-white border rounded-lg shadow-xl mt-5 flex flex-col items-center sm:flex-row sm:justify-between gap-3">
      {/* Left Section - Signature/Stamp */}

      {enabled ? <Stamp /> : <Signature />}
      
      {/* Toggle Switch */}
      <div className="flex flex-col items-center">
        <label className="flex items-center cursor-pointer">
          <span className="mr-3 text-gray-700 font-medium">Signature</span>
          <input type="checkbox" className="hidden" checked={enabled} onChange={handleToggle} />
          <div
            className="w-14 h-7 flex items-center rounded-full p-1 transition relative"
            style={{ backgroundColor: enabled ? "#3B82F6" : "#6B7280" }}
          >
            <div
              className={`bg-white w-6 h-6 rounded-full shadow-md transform transition absolute ${
                enabled ? "translate-x-7" : "translate-x-0"
              }`}
            ></div>
          </div>
          <span className="ml-3 text-gray-700 font-medium">Stamp</span>
        </label>
      </div>
    </div>
  );
}

export default SignatureSelection;
