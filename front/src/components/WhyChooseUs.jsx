import React from "react";

const features = [
  { 
    icon: "fas fa-percentage", 
    title: "Save Up to 85%",
    description: "Get genuine generic medicines at fraction of the cost of branded ones",
    color: "#0057B8"
  },
  { 
    icon: "fas fa-check-circle", 
    title: "Quality Assured",
    description: "All medicines are WHO-GMP certified and NABL lab tested",
    color: "#4CAF50"
  },
  { 
    icon: "fas fa-user-md", 
    title: "Expert Guidance",
    description: "Get pharmacist support and doctor recommendations",
    color: "#9C27B0"
  },
  { 
    icon: "fas fa-truck", 
    title: "Fast Delivery",
    description: "Free delivery across 35000+ pincodes in India",
    color: "#FF9800"
  },
  { 
    icon: "fas fa-shield-alt", 
    title: "100% Genuine",
    description: "Directly sourced from licensed manufacturers",
    color: "#E91E63"
  },
  { 
    icon: "fas fa-undo", 
    title: "Easy Returns",
    description: "Hassle-free return policy within 7 days",
    color: "#00BCD4"
  },
];

const WhyChooseUs = () => (
  <section className="py-12 px-4 bg-white">
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Why Choose MediEase?</h2>
        <p className="text-gray-500">India's most trusted generic medicine pharmacy</p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
        {features.map((feature, idx) => (
          <div 
            key={idx} 
            className="flex flex-col items-center text-center bg-[#F5F7FA] rounded-xl p-5 hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer border border-gray-100 hover:border-[#0057B8]/30"
          >
            <div 
              className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
              style={{ backgroundColor: `${feature.color}15` }}
            >
              <i className={`${feature.icon} text-2xl`} style={{ color: feature.color }}></i>
            </div>
            <h3 className="font-semibold text-gray-800 mb-1 text-sm">{feature.title}</h3>
            <p className="text-xs text-gray-500 leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default WhyChooseUs;
