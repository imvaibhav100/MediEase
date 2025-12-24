
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const FeaturedProducts = () => {
  const products = useSelector((state) => state.products);
  
  // Get discount percentage (simulated)
  const getDiscount = () => Math.floor(Math.random() * 30) + 60;
  
  return (
    <section className="py-12 px-4 bg-[#F5F7FA]">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">In The Spotlight</h2>
            <p className="text-gray-500">Best-selling generic medicines this month</p>
          </div>
          <Link 
            to="/medicines" 
            className="hidden md:flex items-center text-[#0057B8] font-semibold hover:underline"
          >
            View All <i className="fas fa-arrow-right ml-2"></i>
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {products.slice(0, 10).map((product, idx) => {
            const discount = getDiscount();
            const mrp = Math.round(product.price * (100 / (100 - discount)));
            
            return (
              <Link 
                key={idx} 
                to={`/medicines/${encodeURIComponent(product.name)}`}
                className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-xl hover:border-[#0057B8]/30 transition-all group"
              >
                {/* Image/Icon Area */}
                <div className="relative bg-gray-50 p-4 flex items-center justify-center h-28">
                  <span className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded">
                    {discount}% OFF
                  </span>
                  <i className="fas fa-pills text-3xl text-gray-300 group-hover:text-[#0057B8] transition-colors"></i>
                </div>
                
                {/* Content */}
                <div className="p-3">
                  <h3 className="font-semibold text-gray-800 text-sm mb-1 line-clamp-2 group-hover:text-[#0057B8] transition-colors">
                    {product.name}
                  </h3>
                  
                  {product.salt && (
                    <p className="text-xs text-gray-400 mb-2 line-clamp-1">{product.salt}</p>
                  )}
                  
                  {/* Price */}
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-lg font-bold text-[#0057B8]">₹{product.price}</span>
                    <span className="text-xs text-gray-400 line-through">₹{mrp}</span>
                  </div>
                  
                  {/* Add to Cart */}
                  <button className="w-full bg-[#0057B8] text-white py-2 rounded-lg text-xs font-medium hover:bg-[#004494] transition-colors">
                    <i className="fas fa-cart-plus mr-1"></i> Add to Cart
                  </button>
                </div>
              </Link>
            );
          })}
        </div>
        
        {/* Mobile View All Button */}
        <div className="text-center mt-6 md:hidden">
          <Link 
            to="/medicines"
            className="inline-flex items-center bg-white border-2 border-[#0057B8] text-[#0057B8] px-6 py-2 rounded-lg font-semibold"
          >
            View All Medicines <i className="fas fa-arrow-right ml-2"></i>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
