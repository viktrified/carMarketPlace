import React, { useEffect } from "react";
import { X } from "lucide-react";

const CarDetailsModal = ({ car, onClose }) => {
  if (!car) return null;

  // Prevent background scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose} // Close modal when clicking outside
    >
      <div
        className="bg-gradient-to-b from-purple-900 to-black text-white p-6 rounded-lg shadow-lg w-96 relative"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <button
          className="absolute top-3 right-3 text-gray-300 hover:text-white"
          onClick={onClose}
        >
          <X size={24} />
        </button>

        <img
          src={car.image}
          alt={car.name}
          className="w-full h-40 object-cover rounded-md"
        />
        <h2 className="text-2xl font-bold mt-4">{car.name}</h2>
        <p className="text-lg text-green-400">{car.price}</p>
        <p className="text-sm text-gray-300">Owned by: {car.owner}</p>
        <p className="mt-2">{car.description || "No description available."}</p>
      </div>
    </div>
  );
};

export default CarDetailsModal;
