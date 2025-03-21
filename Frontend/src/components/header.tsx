import React, { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "./ui/input";
import { cn } from "../lib/utils";
import { Search } from "lucide-react";
import newLogo from "../assets/new.png";
import { Link, useLocation } from "react-router-dom";
import RegisterCarModal from "../components/modals/registerCar";

const Header: React.FC = () => {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      <header className="bg-gradient-to-r from-purple-800 via-maroon-700 to-black p-4 flex items-center justify-between shadow-lg font-sour">
        <div
          className="text-white text-3xl font-bold cursor-pointer -mr-10"
          onClick={() => window.location.reload()}
        >
          <img src={newLogo} alt="Logo" className="h-auto w-[200px]" />
        </div>

        <nav className="flex gap-6 text-white text-lg -mr-16">
          {["Cars for Sale", "Auction"].map((item) => {
            const route = item.toLowerCase().replace(/ /g, "");
            const isActive = location.pathname === `/${route}`;

            return (
              <motion.div key={item} whileTap={{ scale: 1.1 }}>
                <Link
                  to={`/${route}`}
                  className={`cursor-pointer ${
                    isActive ? "text-[#b50859]" : "hover:text-[#b50859]"
                  }`}
                >
                  {item}
                </Link>
              </motion.div>
            );
          })}
        </nav>

        <motion.div className="relative">
          <Input
            type="text"
            placeholder="Search for any Car"
            className={cn(
              "px-9 py-2 bg-purple-200 text-black transition-all duration-500 border border-gray-300",
              isSearchActive && "shadow-lg animate-pulse"
            )}
            onFocus={() => setIsSearchActive(true)}
            onBlur={() => setIsSearchActive(false)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 transition-all duration-500 text-gray-400 w-5 h-5 rounded-full -mr-9" />
        </motion.div>

        {/* Open Modal Button */}
        <motion.button whileTap={{ scale: 1.1 }}>
          <button
            onClick={() => setIsModalOpen(true)}
            className="border border-gray-300 text-white px-4 py-2 rounded-lg bg-[#1c092b]"
          >
            Add Your Car
          </button>
        </motion.button>

        <motion.button whileTap={{ scale: 1.1 }}>
          <button className="border border-gray-300 text-white px-4 py-2 rounded-lg -ml-16 mr-3 bg-[#1c092b]">
            Connect Wallet
          </button>
        </motion.button>
      </header>

      {/* Register Car Modal */}
      <RegisterCarModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default Header;
