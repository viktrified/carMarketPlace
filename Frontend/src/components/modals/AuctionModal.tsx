import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, User, DollarSign, X } from "lucide-react";

interface AuctionModalProps {
  car: {
    id: number;
    name: string;
    seller: string;
    currentBid: string;
    timeLeft: number;
    image: string;
  };
  onClose: () => void;
}

const AuctionModal: React.FC<AuctionModalProps> = ({ car, onClose }) => {
  const [bidAmount, setBidAmount] = useState("");
  const [timeLeft, setTimeLeft] = useState(car.timeLeft);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number): string => {
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m`;
  };

  const handleBid = () => {
    if (!bidAmount || parseFloat(bidAmount) <= parseFloat(car.currentBid)) {
      alert("Bid amount must be higher than the current bid.");
      return;
    }
    alert(`Bid placed: ${bidAmount} ETH on ${car.name}`);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <motion.div
        className="bg-black p-6 rounded-lg shadow-lg text-white w-[400px] relative"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-gray-400"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        {/* Car Image */}
        <img
          src={car.image}
          alt={car.name}
          className="w-full h-40 object-cover rounded-md"
        />

        {/* Car Info */}
        <h2 className="text-xl font-bold mt-3">{car.name}</h2>
        <div className="flex items-center text-gray-300 mt-2">
          <User className="w-4 h-4 mr-2" />
          <span>
            {car.seller.slice(0, 6)}...{car.seller.slice(-4)}
          </span>
        </div>
        <div className="flex items-center text-green-400 mt-2">
          <DollarSign className="w-4 h-4 mr-2" />
          <span>Current Bid: {car.currentBid}</span>
        </div>
        <div className="flex items-center text-red-400 mt-2">
          <Clock className="w-4 h-4 mr-2" />
          <span>Time Left: {formatTime(timeLeft)}</span>
        </div>

        {/* Bid Input */}
        <input
          type="number"
          value={bidAmount}
          onChange={(e) => setBidAmount(e.target.value)}
          placeholder="Enter your bid (ETH)"
          className="mt-4 w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
        />

        {/* Place Bid Button */}
        <button
          className="mt-4 w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg"
          onClick={handleBid}
        >
          Place Bid
        </button>
      </motion.div>
    </div>
  );
};

export default AuctionModal;
