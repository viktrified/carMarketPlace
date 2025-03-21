import React, { useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

const RegisterCarModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    color: "",
    description: "",
    price: "",
    tokenURI: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting Car Data:", formData);
    onClose(); // Close modal after submission
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20"
      onClick={onClose} // Close when clicking outside
    >
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="bg-white p-6 rounded-lg shadow-lg w-96 text-black relative"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-black"
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold mb-4 text-center">
          Register Your Car
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="name"
            placeholder="Car Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="color"
            placeholder="Car Color"
            value={formData.color}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />
          <input
            type="number"
            name="price"
            placeholder="Price (ETH)"
            value={formData.price}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="tokenURI"
            placeholder="Car Image URI"
            value={formData.tokenURI}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />
          <button
            type="submit"
            className="bg-purple-700 text-white p-2 rounded hover:bg-purple-800"
          >
            Register Car
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default RegisterCarModal;
