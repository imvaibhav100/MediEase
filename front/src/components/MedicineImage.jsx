import React from "react";
import defaultMedImg from "../images/default-medicine.png";

const MedicineImage = ({ src, alt }) => {
  return (
    <img
      src={src || defaultMedImg}
      alt={alt || "Medicine"}
      className="w-16 h-16 object-contain rounded-lg shadow border border-gray-200 bg-white mr-4"
    />
  );
};

export default MedicineImage;
