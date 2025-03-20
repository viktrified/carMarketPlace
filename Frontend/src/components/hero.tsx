import React from "react";
import car1 from "../assets/car1.png";
import { useState } from "react";
import { Heart } from "lucide-react";

const Hero: React.FC = () => {
  const [liked, setLiked] = useState(false);
  const owner = "0xff55eec7958da1551f5309af4c6df926253fc661";

  return (
    <div
      className="relative w-full bg-gradient-to-b from-purple-900 to-gray-900 flex items-center justify-center px-10"
      style={{ height: "calc(100vh - 74px)" }}
    >
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 items-center gap-8 text-white">
        <div className="text-left">
          <div className="flex gap-6 items-baseline">
            <h1 className="text-5xl font-bold">Lamborghini Urus</h1>
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
            description:
            <span>
              Experience the perfect blend of power, luxury, and practicality
              with this Lamborghini Urus. This high-performance SUV is powered
              by a 4.0L twin-turbo V8 engine, delivering 641 HP and an
              incredible 0-60 mph in just 3.5 seconds.
            </span>
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
        <div className="flex justify-end">
          <img
            src={car1}
            alt="Hyundai Tucson"
            className="w-auto max-w-2xl drop-shadow-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
