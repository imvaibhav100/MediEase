import React, { useState } from "react";
import axios from "axios";
import { BACKEND_BASE } from '../api';

const SaltFinder = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [result, setResult] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    setNotFound(false);
    setResult(null);
    
    try {
      // Call backend API which does web scraping from 1mg
      const response = await axios.get(`${BACKEND_BASE}/api/get-salt?brandName=${encodeURIComponent(searchTerm.trim())}`);
      
      if (response.data.found && response.data.saltComposition) {
        setResult({ 
          brand: searchTerm, 
          salts: response.data.saltComposition,
          saltString: response.data.saltString 
        });
        setNotFound(false);
      } else {
        setResult(null);
        setNotFound(true);
      }
    } catch (error) {
      console.error("Error fetching salt composition:", error);
      setResult(null);
      setNotFound(true);
    }
    
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setResult(null);
    setNotFound(false);
  };

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#0057B8] to-[#00A6E3] rounded-full mb-4 shadow-lg">
            <i className="fas fa-flask text-white text-2xl"></i>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            Know Your Medicine's <span className="text-[#0057B8]">Salt Composition</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Enter any branded medicine name to instantly find its salt/composition. 
            Knowledge is power - know what you're taking!
          </p>
        </div>

        {/* Search Box */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <i className="fas fa-pills absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter medicine name (e.g., Crocin, Dolo, Combiflam...)"
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-[#0057B8] focus:outline-none text-lg transition-all"
              />
              {searchTerm && (
                <button 
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <i className="fas fa-times"></i>
                </button>
              )}
            </div>
            <button
              onClick={handleSearch}
              disabled={loading}
              className="bg-gradient-to-r from-[#0057B8] to-[#00A6E3] text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Searching...
                </>
              ) : (
                <>
                  <i className="fas fa-search"></i>
                  Find Salt
                </>
              )}
            </button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="mt-6 p-6 bg-blue-50 rounded-xl border border-blue-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 border-4 border-[#0057B8] border-t-transparent rounded-full animate-spin"></div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Searching...</h3>
                  <p className="text-gray-500 text-sm">Fetching salt composition from 1mg.com</p>
                </div>
              </div>
            </div>
          )}

          {/* Result */}
          {result && !loading && (
            <div className="mt-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 animate-fade-in">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-check text-white text-xl"></i>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {result.brand.toUpperCase()}
                  </h3>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-gray-600 font-medium">Salt Composition:</span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1">
                      <i className="fas fa-globe"></i> From 1mg.com
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.salts.map((salt, idx) => (
                      <span
                        key={idx}
                        className="bg-white px-4 py-2 rounded-lg border border-green-300 text-green-700 font-medium shadow-sm"
                      >
                        {salt}
                      </span>
                    ))}
                  </div>
                  <p className="mt-4 text-sm text-gray-500 flex items-start gap-2">
                    <i className="fas fa-info-circle mt-0.5"></i>
                    Generic medicines with same salt composition are equally effective and more affordable.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Not Found */}
          {notFound && !loading && (
            <div className="mt-6 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-exclamation text-white text-xl"></i>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-1">Medicine Not Found</h3>
                  <p className="text-gray-600">
                    Could not find salt composition for "{searchTerm}" on 1mg.com. Please check spelling or try another medicine name.
                  </p>
                  <p className="mt-2 text-sm text-gray-500">
                    <i className="fas fa-lightbulb mr-1 text-yellow-500"></i>
                    Tip: Try exact brand names like Crocin, Dolo 650, Combiflam, etc.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Popular Medicines */}
          {!result && !notFound && !loading && (
            <div className="mt-6">
              <p className="text-sm text-gray-500 mb-3">
                <i className="fas fa-fire text-orange-500 mr-1"></i> Popular searches:
              </p>
              <div className="flex flex-wrap gap-2">
                {["Dolo 650", "Crocin", "Combiflam", "Pan 40", "Cetzine", "Azithral", "Sinarest", "Allegra"].map((med) => (
                  <button
                    key={med}
                    onClick={() => {
                      setSearchTerm(med);
                      handleSearch();
                    }}
                    className="px-4 py-2 bg-gray-100 hover:bg-[#0057B8] hover:text-white rounded-full text-sm text-gray-600 transition-all"
                  >
                    {med}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-10">
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-globe text-[#0057B8] text-xl"></i>
            </div>
            <h3 className="font-bold text-gray-800 mb-2">Live Web Scraping</h3>
            <p className="text-sm text-gray-600">Salt data fetched directly from 1mg.com in real-time</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-bolt text-green-600 text-xl"></i>
            </div>
            <h3 className="font-bold text-gray-800 mb-2">Instant Results</h3>
            <p className="text-sm text-gray-600">Get salt composition in milliseconds, no waiting</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-rupee-sign text-purple-600 text-xl"></i>
            </div>
            <h3 className="font-bold text-gray-800 mb-2">Save Money</h3>
            <p className="text-sm text-gray-600">Find affordable generic alternatives with same salt</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SaltFinder;
