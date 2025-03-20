import React from "react";
import Header from "../components/header";
import Hero from "../components/hero";

const Home: React.FC = () => {
  return (
    <div className="h-screen flex flex-col">
      <Header />
      {/* <div className="flex-1" style={{ height: "calc(100vh - 80px)" }}> */}
        <Hero />
      {/* </div> */}
    </div>
  );
};

export default Home;
