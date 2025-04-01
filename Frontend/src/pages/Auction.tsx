import React, { useState } from "react";
import { Clock, User, DollarSign } from "lucide-react";
import AuctionModal from "../components/modals/AuctionModal";
import car6 from "../assets/car6.png";
import car3 from "../assets/car3.png";

const auctions = [
  {
    id: 1,
    name: "Lamborghini Urus",
    seller: "0xff55eec7958da1551f5309af4c6df926253fc661",
    currentBid: "2.5 ETH",
    timeLeft: 7200, // seconds (2 hours)
    image: car6, // Use imported image
  },
  {
    id: 2,
    name: "Ferrari Purosangue",
    seller: "0xab12cd34ef56gh78ij90kl12mn34op56qr78st90",
    currentBid: "3.2 ETH",
    timeLeft: 14400, // seconds (4 hours)
    image: car3, // Use imported image
  },
  {
    id: 2,
    name: "Ferrari Purosangue",
    seller: "0xab12cd34ef56gh78ij90kl12mn34op56qr78st90",
    currentBid: "3.2 ETH",
    timeLeft: 14400, // seconds (4 hours)
    image: car3, // Use imported image
  },
  {
    id: 2,
    name: "Ferrari Purosangue",
    seller: "0xab12cd34ef56gh78ij90kl12mn34op56qr78st90",
    currentBid: "3.2 ETH",
    timeLeft: 14400, // seconds (4 hours)
    image: car3, // Use imported image
  },
  {
    id: 2,
    name: "Ferrari Purosangue",
    seller: "0xab12cd34ef56gh78ij90kl12mn34op56qr78st90",
    currentBid: "3.2 ETH",
    timeLeft: 14400, // seconds (4 hours)
    image: car3, // Use imported image
  },
  {
    id: 2,
    name: "Ferrari Purosangue",
    seller: "0xab12cd34ef56gh78ij90kl12mn34op56qr78st90",
    currentBid: "3.2 ETH",
    timeLeft: 14400, // seconds (4 hours)
    image: car3, // Use imported image
  },
  {
    id: 2,
    name: "Ferrari Purosangue",
    seller: "0xab12cd34ef56gh78ij90kl12mn34op56qr78st90",
    currentBid: "3.2 ETH",
    timeLeft: 14400, // seconds (4 hours)
    image: car3, // Use imported image
  },
  {
    id: 2,
    name: "Ferrari Purosangue",
    seller: "0xab12cd34ef56gh78ij90kl12mn34op56qr78st90",
    currentBid: "3.2 ETH",
    timeLeft: 14400, // seconds (4 hours)
    image: car3, // Use imported image
  },
];

const Auction = () => {
  const [selectedCar, setSelectedCar] = useState(null);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-purple-900 to-black text-white p-10">
      <h1 className="text-4xl font-bold mb-6">Live Auctions</h1>
      <div className="grid grid-cols-4 gap-6">
        {auctions.map((car) => (
          <div
            key={car.id}
            className="bg-black bg-opacity-40 p-4 rounded-lg shadow-lg flex flex-col items-center"
          >
            <img
              src={car.image}
              alt={car.name}
              className="w-full h-40 object-cover rounded-md"
            />
            <h2 className="text-lg font-semibold mt-2">{car.name}</h2>
            <div className="flex items-center text-gray-300 mt-1">
              <User className="w-4 h-4 mr-2" />
              <span>
                {car.seller.slice(0, 6)}...{car.seller.slice(-4)}
              </span>
            </div>
            <div className="flex items-center text-green-400 mt-1">
              <DollarSign className="w-4 h-4 mr-2" />
              <span>{car.currentBid}</span>
            </div>
            <div className="flex items-center text-red-400 mt-1">
              <Clock className="w-4 h-4 mr-2" />
              <span>{car.timeLeft / 3600}h left</span>
            </div>
            <button
              className="mt-4 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg"
              onClick={() => setSelectedCar(car)}
            >
              Place Bid
            </button>
          </div>
        ))}
      </div>

      {/* Render Auction Modal if a car is selected */}
      {selectedCar && (
        <AuctionModal car={selectedCar} onClose={() => setSelectedCar(null)} />
      )}
    </div>
  );
};

export default Auction;























