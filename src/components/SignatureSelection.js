import React from "react";
import Signature from "./Signature";
import Stamp from "./Stamp";

function SignatureSelection() {
  return (
    <div className="p-6 mt-5 mb-6 bg-white border rounded-lg shadow-xl border-gray-200 flex flex-col md:flex-row items-center gap-4 dark:bg-gray-800 dark:border-gray-700">
      
      {/* Signature Section */}
      <div className="w-full md:w-1/2">
        <Signature />
      </div>

      {/* Vertical Divider Line */}
      <div className="w-full md:w-px h-px md:h-32 bg-gray-300 dark:bg-gray-600"></div>

      {/* Stamp Section */}
      <div className="w-full md:w-1/2">
        <Stamp />
      </div>
      
    </div>
  );
}

export default SignatureSelection;