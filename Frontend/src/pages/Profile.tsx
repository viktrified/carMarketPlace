import { useParams } from "react-router-dom";

const Profile = () => {
  const { address } = useParams<{ address: string }>();

  // Placeholder user data
  const userData = {
    followers: 123,
    totalAuctionParticipatingIn: 5,
    itemsListed: 10,
    itemsWon: [
      { name: "Lamborghini Urus", price: "2.5 ETH", image: "/car1.png" },
      { name: "Ferrari Purosangue", price: "3.2 ETH", image: "/car2.png" },
    ],
    carsOwned: [
      { name: "Bugatti Chiron", price: "4.8 ETH", image: "/car3.png" },
    ],
    carSoldCount: 7,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-black text-white p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">User Profile</h1>
        <p className="text-gray-300 text-lg">Address: {address}</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
          <div className="bg-purple-800 p-4 rounded-lg shadow-lg text-center">
            <h2 className="text-lg font-semibold">Followers</h2>
            <p className="text-green-400 text-xl">{userData.followers}</p>
          </div>
          <div className="bg-purple-800 p-4 rounded-lg shadow-lg text-center">
            <h2 className="text-lg font-semibold">Auctions Participated</h2>
            <p className="text-green-400 text-xl">
              {userData.totalAuctionParticipatingIn}
            </p>
          </div>
          <div className="bg-purple-800 p-4 rounded-lg shadow-lg text-center">
            <h2 className="text-lg font-semibold">Items Listed</h2>
            <p className="text-green-400 text-xl">{userData.itemsListed}</p>
          </div>
          <div className="bg-purple-800 p-4 rounded-lg shadow-lg text-center">
            <h2 className="text-lg font-semibold">Cars Sold</h2>
            <p className="text-green-400 text-xl">{userData.carSoldCount}</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold mt-8">Cars Won</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {userData.itemsWon.map((car, index) => (
            <div key={index} className="bg-black p-4 rounded-lg shadow-lg">
              <img
                src={car.image}
                alt={car.name}
                className="w-full h-40 object-cover rounded-lg"
              />
              <p className="text-lg font-semibold mt-2">{car.name}</p>
              <p className="text-green-400">{car.price}</p>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-bold mt-8">Cars Owned</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {userData.carsOwned.map((car, index) => (
            <div key={index} className="bg-black p-4 rounded-lg shadow-lg">
              <img
                src={car.image}
                alt={car.name}
                className="w-full h-40 object-cover rounded-lg"
              />
              <p className="text-lg font-semibold mt-2">{car.name}</p>
              <p className="text-green-400">{car.price}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
