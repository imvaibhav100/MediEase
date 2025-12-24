import React from "react";

const HeroBanner = () => {
  return (
  <section className="w-full bg-gradient-to-r from-[#0057B8] to-[#00A0E3] py-12 md:py-16 flex flex-col md:flex-row items-center justify-between px-4 md:px-16">
      <div className="flex-1 mb-6 md:mb-0 max-w-2xl">
  <p className="text-white/90 text-sm font-medium mb-2 flex items-center"><span className="bg-white/20 px-2 py-0.5 rounded text-xs mr-2">WHO GMP Certified</span> Generic Medicines</p>
  <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
          Save Up to <span className="text-yellow-300">85%</span> on Your Medicines
        </h1>
  <p className="text-lg text-white/90 mb-6">India's Most Trusted Generic Medicine Pharmacy</p>
  <div className="flex flex-wrap gap-3 mb-6">
    <button className="bg-white text-[#0057B8] px-6 py-3 rounded-lg font-semibold shadow-lg hover:bg-gray-100 transition-all flex items-center"><i className="fas fa-search mr-2"></i>Search Medicine</button>
    <button className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-all flex items-center"><i className="fas fa-upload mr-2"></i>Upload Prescription</button>
  </div>
  <div className="flex flex-wrap items-center gap-4">
          <span className="flex items-center text-white text-sm"><i className="fas fa-check-circle text-green-300 mr-2"></i>Quality Checked</span>
          <span className="flex items-center text-white text-sm"><i className="fas fa-truck text-green-300 mr-2"></i>Free Delivery</span>
          <span className="flex items-center text-white text-sm"><i className="fas fa-shield-alt text-green-300 mr-2"></i>100% Genuine</span>
        </div>
      </div>
      <div className="flex-1 flex justify-center">
        <div className="relative">
          <img src="https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=600&q=80" alt="Generic Medicines" className="w-64 h-64 md:w-80 md:h-80 object-cover rounded-2xl shadow-2xl" />
          <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg p-3">
            <p className="text-xs text-gray-500">Happy Customers</p>
            <p className="text-xl font-bold text-[#0057B8]">10 Lakh+</p>
          </div>
          <div className="absolute -top-4 -right-4 bg-yellow-400 rounded-xl shadow-lg p-3">
            <p className="text-xs text-gray-800">Save Upto</p>
            <p className="text-xl font-bold text-gray-900">85%</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
