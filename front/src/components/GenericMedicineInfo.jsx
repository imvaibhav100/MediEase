import React, { useState } from "react";
import axios from "axios";

const GenericMedicineInfo = () => {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  // Search handler
  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");
    setResults([]);
    if (!search.trim()) {
      setError("Please enter a private medicine name.");
      return;
    }
    try {
      // Call backend API to get private medicine by name
      const res = await axios.get(`/api/medicines/private-medicine/search?name=${encodeURIComponent(search)}`);
      if (res.data && Array.isArray(res.data)) {
        // Always treat any returned array (even fallback salt-only) as a valid result
        const sorted = [...res.data].sort((a, b) => a.mrp - b.mrp);
        setResults(sorted);
        if (sorted.length === 0) {
          setError("No generic alternative found for this medicine.");
        }
      } else {
        setResults([]);
        setError("No generic alternative found for this medicine.");
      }
    } catch (err) {
      setResults([]);
      setError("Medicine not found or server error.");
    }
  };

  const features = [
    {
      icon: "fas fa-award",
      title: "Reliable",
      description: "Made with high-quality standards, our generics provide reliable, consistent results you can trust.",
      color: "text-emerald-600",
      bgColor: "bg-emerald-100"
    },
    {
      icon: "fas fa-shield-alt",
      title: "Secure",
      description: "Each medicine meets strict safety standards, ensuring trusted care with every dose.",
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      icon: "fas fa-rupee-sign",
      title: "Affordable",
      description: "Quality treatments without the high price, making better health accessible for all.",
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    },
    {
      icon: "fas fa-check-circle",
      title: "Effective",
      description: "Clinically proven to deliver the same benefits as branded alternatives, without compromise.",
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    }
  ];

  return (
    <section className="py-12 px-4 bg-gradient-to-r from-blue-50 via-emerald-50 to-orange-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="mr-4 bg-white rounded-full p-3 shadow-md">
              <i className="fas fa-bullhorn text-4xl text-emerald-600"></i>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              Generic medicine is a right choice.
            </h2>
          </div>
          <button className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white px-6 py-2 rounded-full font-medium flex items-center shadow-md transition">
            Know More
            <i className="fas fa-play ml-2"></i>
          </button>
        </div>

        {/* Search Private Medicine */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-center gap-4">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Enter private medicine name..."
              className="px-4 py-2 rounded border border-gray-300 w-full md:w-96"
            />
            <button type="submit" className="bg-emerald-600 text-white px-6 py-2 rounded font-medium shadow-md hover:bg-emerald-700">
              Find Generic Alternative
            </button>
          </form>
          {error && <div className="text-red-600 mt-2">{error}</div>}
        </div>

        {/* Show Generic Medicine Results or Error */}
        {results.length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-md border border-emerald-100 mb-8">
            <h3 className="text-xl font-bold text-emerald-700 mb-4">Generic Alternatives Found:</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left border-collapse">
                <thead>
                  <tr className="bg-emerald-50">
                    <th className="py-2 px-4 font-semibold">Name</th>
                    <th className="py-2 px-4 font-semibold">Unit Size</th>
                    <th className="py-2 px-4 font-semibold">MRP</th>
                    <th className="py-2 px-4 font-semibold">Composition</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((med, idx) => (
                    <tr key={med.name + med.company + med.mrp} className={idx === 0 ? "bg-orange-50 font-bold" : ""}>
                      <td className="py-2 px-4">{med.name}</td>
                      <td className="py-2 px-4">{med.company}</td>
                      <td className="py-2 px-4">₹{med.mrp} {idx === 0 && <span className="text-emerald-600 font-semibold ml-2">Lowest Price</span>}</td>
                      <td className="py-2 px-4">{med.composition}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {error && results.length === 0 && (
          <div className="bg-red-100 text-red-700 rounded p-4 mb-8">{error}</div>
        )}

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition border border-gray-100">
              <div className="flex items-center mb-3">
                <div className={`w-12 h-12 rounded-full ${feature.bgColor} flex items-center justify-center mr-3`}>
                  <i className={`${feature.icon} text-xl ${feature.color}`}></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">{feature.title}</h3>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom Trust Badge */}
        <div className="text-center mt-8">
          <div className="inline-flex items-center bg-white rounded-full px-6 py-3 shadow-md border border-blue-100">
            <i className="fas fa-certificate text-blue-500 mr-2"></i>
            <span className="text-gray-700 font-medium">Trusted by 10+ Lakh Families across India</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GenericMedicineInfo;
