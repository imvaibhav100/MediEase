import React from "react";

const GenericInfoBanner = ({ genericName, privateName, privateMrp, genericMrp }) => {
  if (!genericName || !privateName) return null;
  const savings = privateMrp && genericMrp ? (privateMrp - genericMrp) : null;
  return (
    <div className="bg-gradient-to-r from-emerald-100 to-blue-50 border border-emerald-300 rounded-xl shadow-lg p-4 mb-4 flex items-center justify-between animate-fadeIn">
      <div>
        <span className="font-bold text-emerald-700 text-lg">Save big with generics!</span>
        <div className="mt-1 text-gray-700">
          <span className="font-semibold">Private Brand:</span> {privateName} {privateMrp && (<span className="text-red-600 font-bold">₹{privateMrp}</span>)}
        </div>
        <div className="mt-1 text-gray-700">
          <span className="font-semibold">Generic Alternative:</span> {genericName} {genericMrp && (<span className="text-orange-600 font-bold">₹{genericMrp}</span>)}
        </div>
        {savings && savings > 0 && (
          <div className="mt-2 text-green-700 font-semibold">You save ₹{savings} by choosing generic!</div>
        )}
      </div>
      <div>
        <button className="bg-gradient-to-r from-orange-500 to-emerald-600 text-white px-6 py-2 rounded font-semibold shadow hover:from-orange-600 hover:to-emerald-700 transition">Buy Generic</button>
      </div>
    </div>
  );
};

export default GenericInfoBanner;
