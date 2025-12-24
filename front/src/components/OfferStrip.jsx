import React from "react";

const OfferStrip = () => (
  <div className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white text-center py-2 text-sm font-medium flex items-center justify-center">
    <span>🎉 Free Delivery on Orders Above ₹499 + Extra 5% Cashback!</span>
    <button className="ml-4 bg-white text-orange-600 px-3 py-1 rounded-md font-semibold hover:bg-orange-50 transition">Check Offers</button>
  </div>
);

export default OfferStrip;
