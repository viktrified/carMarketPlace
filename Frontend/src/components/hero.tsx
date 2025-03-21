import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import car1 from "../assets/car1.png";
import car2 from "../assets/car2.png";
import car3 from "../assets/car3.png";
import car4 from "../assets/car4.png";
import car5 from "../assets/car5.png";

const cars = [
  {
    image: car1,
    name: "Lamborghini Urus",
    description:
      "A high-performance luxury SUV with a 4.0L twin-turbo V8 engine delivering 641 HP.",
  },
  {
    image: car2,
    name: "Ferrari Purosangue",
    description:
      "Ferrari's first SUV, combining speed and elegance with a powerful V12 engine.",
  },
  {
    image: car3,
    name: "Porsche Cayenne Turbo GT",
    description:
      "A sport-focused SUV with track-level performance and premium comfort.",
  },
  {
    image: car4,
    name: "Aston Martin DBX707",
    description:
      "A refined yet powerful SUV, delivering 697 HP with exceptional handling.",
  },
  {
    image: car5,
    name: "Bentley Bentayga Speed",
    description:
      "Luxury meets performance in this W12-powered SUV with superior craftsmanship.",
  },
];

const CarSearchComponent: React.FC = () => {
  const [liked, setLiked] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const owner = "0xff55eec7958da1551f5309af4c6df926253fc661";

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % cars.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % cars.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? cars.length - 1 : prevIndex - 1
    );
  };

  return (
    <div
      className="relative w-full bg-gradient-to-b from-purple-900 to-gray-900 flex items-center justify-center px-10"
      style={{ height: "calc(100vh - 74px)" }}
    >
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 items-center gap-8 text-white">
        <button
          onClick={handlePrev}
          className="absolute left-4 bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-80"
        >
          <ChevronLeft className="text-white w-8 h-8" />
        </button>
        <div className="text-left">
          <div className="flex gap-6 items-baseline">
            <h1 className="text-5xl font-bold">{cars[currentIndex].name}</h1>
            <button
              onClick={() => setLiked(!liked)}
              className="text-gray-500 transition-transform duration-200 transform hover:scale-110 flex gap-1 items-center"
            >
              <Heart
                className={`w-6 h-6 ${
                  liked ? "fill-red-500 text-red-500" : "text-gray-500"
                }`}
              />
              <span className="text-[21px] pt-[2px]">3</span>
            </button>
          </div>
          <div className="flex text-2xl text-black my-4">
            <span>
              Owner: <span>{`${owner.slice(0, 6)}....${owner.slice(-3)}`}</span>
            </span>
          </div>
          <div>
            <span>{cars[currentIndex].description}</span>
          </div>
          <button className="mt-6 w-full sm:w-auto bg-purple-500 hover:bg-purple-600 text-white py-3 px-8 rounded-lg flex items-center justify-center gap-2">
            <span>Buy</span> 0.5ETH
          </button>
          <div className="mt-4 text-sm text-gray-300">
            <a href="#" className="text-purple-400 underline">
              currently up for auction &rarr;
            </a>
          </div>
        </div>
        <div className="relative w-full max-w-lg h-96 flex items-center justify-center overflow-hidden">
          {cars.map((car, index) => (
            <img
              key={index}
              src={car.image}
              alt={car.name}
              className={`absolute transition-opacity duration-1000 w-full h-full object-cover ${
                index === currentIndex ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}

          <button
            onClick={handleNext}
            className="absolute right-4 bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-80"
          >
            <ChevronRight className="text-white w-8 h-8" />
          </button>
        </div>
      </div>
      <div className="absolute bottom-10 flex gap-2">
        {cars.map((_, index) => (
          <span
            key={index}
            className={`h-1 w-12 border-b-4 ${
              index === currentIndex ? "border-white" : "border-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default CarSearchComponent;
