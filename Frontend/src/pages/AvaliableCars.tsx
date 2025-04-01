import { useNavigate } from "react-router-dom";
import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, User, DollarSign } from "lucide-react";
import CarDetailsModal from "../components/modals/fullInfo";

import car1 from "../assets/car1.png";
import car2 from "../assets/car2.png";
import car3 from "../assets/car3.png";
import car4 from "../assets/car4.png";
import car5 from "../assets/car5.png";
import car6 from "../assets/car6.png";
import car7 from "../assets/car7.png";
import car8 from "../assets/car8.png";
import car9 from "../assets/car9.png";
import car10 from "../assets/car10.png";

const carCategories = [
  {
    title: "Most Liked",
    cars: [
      {
        image: car1,
        name: "Lamborghini Urus",
        price: "2.5 ETH",
        owner: "0xff55...c661",
      },
      {
        image: car2,
        name: "Ferrari",
        price: "3.2 ETH",
        owner: "0xab12...st90",
      },
      {
        image: car3,
        name: "Bugatti Chiron",
        price: "4.8 ETH",
        owner: "0xcd34...op56",
      },
      {
        image: car4,
        name: "McLaren P1",
        price: "3.7 ETH",
        owner: "0xef56...gh78",
      },
      {
        image: car5,
        name: "Porsche 911",
        price: "1.9 ETH",
        owner: "0.kl12...mn34",
      },
      {
        image: car6,
        name: "Aston Martin",
        price: "2.2 ETH",
        owner: "0.op56...qr78",
      },
    ],
  },
  {
    title: "Latest",
    cars: [
      {
        image: car7,
        name: "Tesla Model S",
        price: "1.5 ETH",
        owner: "0.st90...uv12",
      },
      { image: car8, name: "BMW i8", price: "2.1 ETH", owner: "0.wx34...yz56" },
      {
        image: car9,
        name: "Audi R8",
        price: "2.7 ETH",
        owner: "0.ab12...cd34",
      },
      {
        image: car10,
        name: "Mercedes AMG GT",
        price: "3.3 ETH",
        owner: "0.ef56...gh78",
      },
      {
        image: car1,
        name: "Ford Mustang GT",
        price: "1.3 ETH",
        owner: "0.ij90...kl12",
      },
      {
        image: car1,
        name: "Chevrolet Corvette",
        price: "2.0 ETH",
        owner: "0.mn34...op56",
      },
    ],
  },
  {
    title: "Latest",
    cars: [
      {
        image: car7,
        name: "Tesla Model S",
        price: "1.5 ETH",
        owner: "0.st90...uv12",
      },
      { image: car8, name: "BMW i8", price: "2.1 ETH", owner: "0.wx34...yz56" },
      {
        image: car9,
        name: "Audi R8",
        price: "2.7 ETH",
        owner: "0.ab12...cd34",
      },
      {
        image: car10,
        name: "Mercedes AMG GT",
        price: "3.3 ETH",
        owner: "0.ef56...gh78",
      },
      {
        image: car1,
        name: "Ford Mustang GT",
        price: "1.3 ETH",
        owner: "0.ij90...kl12",
      },
      {
        image: car1,
        name: "Chevrolet Corvette",
        price: "2.0 ETH",
        owner: "0.mn34...op56",
      },
    ],
  },
  {
    title: "Latest",
    cars: [
      {
        image: car7,
        name: "Tesla Model S",
        price: "1.5 ETH",
        owner: "0.st90...uv12",
      },
      { image: car8, name: "BMW i8", price: "2.1 ETH", owner: "0.wx34...yz56" },
      {
        image: car9,
        name: "Audi R8",
        price: "2.7 ETH",
        owner: "0.ab12...cd34",
      },
      {
        image: car10,
        name: "Mercedes AMG GT",
        price: "3.3 ETH",
        owner: "0.ef56...gh78",
      },
      {
        image: car1,
        name: "Ford Mustang GT",
        price: "1.3 ETH",
        owner: "0.ij90...kl12",
      },
      {
        image: car1,
        name: "Chevrolet Corvette",
        price: "2.0 ETH",
        owner: "0.mn34...op56",
      },
    ],
  },
];

const CarsForSale = ({ address }: { address: string }) => {
  const navigate = useNavigate();
  const scrollRefs = useRef<React.RefObject<HTMLDivElement>[]>([]);
  const [selectedCar, setSelectedCar] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-black text-white p-10">
      {/* <h1 className="text-4xl font-bold mb-6">Cars for Sale</h1> */}

      {carCategories.map((category, index) => {
        // if (!scrollRefs.current[index]) {
        //   // scrollRefs.current[index] = React.createRef();
        // }

        // const scrollLeft = () => {
        //   if (scrollRefs.current[index].current) {
        //     scrollRefs.current[index].current.scrollBy({
        //       left: -300,
        //       behavior: "smooth",
        //     });
        //   }
        // };

        // const scrollRight = () => {
        //   if (scrollRefs.current[index].current) {
        //     scrollRefs.current[index].current.scrollBy({
        //       left: 300,
        //       behavior: "smooth",
        //     });
        //   }
        // };

        return (
          <div key={index} className="mb-8 relative">
            <h2 className="text-2xl font-semibold mb-4">{category.title}</h2>
            <div className="relative w-full">
              <div
                // ref={scrollRefs.current[index]}
                className="flex gap-4"
              >
                {category.cars.map((car, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    className="relative w-48 h-72 bg-black bg-opacity-40 rounded-lg shadow-lg flex flex-col items-center p-4 cursor-pointer"
                    onClick={() => setSelectedCar(car)} // Open modal with selected car
                  >
                    <img
                      src={car.image}
                      alt={car.name}
                      className="w-full h-40 object-cover rounded-md"
                    />
                    <h3 className="text-lg font-semibold mt-2">{car.name}</h3>
                    <div className="flex items-center text-green-400 mt-1">
                      <DollarSign className="w-4 h-4 mr-2" />
                      <span>{car.price}</span>
                    </div>
                    <div className="flex items-center text-gray-300 mt-1">
                      <User className="w-4 h-4 mr-2" />
                      <span onClick={() => navigate(`/profile/${address}`)}>
                        {car.owner.slice(0, 6)}...{car.owner.slice(-4)}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            <button
              // onClick={scrollLeft}
              className="absolute left-0 top-[190px] transform -translate-y-1/2 bg-black bg-opacity-50 p-2 rounded-full"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <button
              // onClick={scrollRight}
              className="absolute right-0 top-[190px] transform -translate-y-1/2 bg-black bg-opacity-50 p-2 rounded-full"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          </div>
        );
      })}

      {/* Car Details Modal */}
      {selectedCar && (
        <CarDetailsModal
          car={selectedCar}
          onClose={() => setSelectedCar(null)}
        />
      )}
    </div>
  );
};

export default CarsForSale;
