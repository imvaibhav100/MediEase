import React from "react";

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-200 p-4 flex flex-col items-center border border-gray-100 hover:border-emerald-200">
  <img src={product.image} alt={product.name} className="w-24 h-24 object-cover rounded-lg shadow mb-2 hover:scale-105 transition-transform duration-200" />
      <span className="font-semibold text-gray-800 mb-1">{product.name}</span>
      <div className="flex items-center space-x-2 mb-1">
        <span className="line-through text-gray-400 text-sm">₹{product.mrp}</span>
        <span className="text-emerald-600 font-bold">₹{product.price}</span>
      </div>
      <div className="flex items-center mb-2">
        {[...Array(5)].map((_, i) => (
          <i
            key={i}
            className={`fas fa-star ${i < product.rating ? "text-amber-400" : "text-gray-300"} text-sm`}
          ></i>
        ))}
      </div>
  <button className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white px-4 py-1.5 rounded-md text-sm font-semibold shadow hover:scale-105 transition-transform duration-200">Add to Cart</button>
    </div>
  );
};

export default ProductCard;
