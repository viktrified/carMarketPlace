// import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Auction from "./pages/Auction";
import Header from "./components/header";
import CarsForSale from "./pages/AvaliableCars";
import Profile from "./pages/Profile";

function App() {
  return (
    <Router>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auction" element={<Auction />} />
        <Route path="/CarsForSale" element={<CarsForSale address="someAddress" />} />
        <Route path="/profile/:address" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
