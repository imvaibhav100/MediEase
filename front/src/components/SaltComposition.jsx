import React from "react";

// Props: { salt, loading, error }
export default function SaltComposition({ salt, loading, error }) {
  return (
    <div className="max-w-md mx-auto my-8 p-6 bg-white rounded-xl shadow-md border border-gray-200">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">Salt Composition</h2>
      {loading ? (
        <div className="text-gray-500 animate-pulse">Loading...</div>
      ) : error ? (
        <div className="text-red-500 font-semibold">{error}</div>
      ) : salt ? (
        <div className="text-lg text-gray-800 whitespace-pre-line">{salt}</div>
      ) : (
        <div className="text-gray-500">No salt composition found.</div>
      )}
    </div>
  );
}
