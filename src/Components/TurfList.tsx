import { Link } from "react-router";


const turfs = [
  {
    _id: 1,
    name: "Green Field Turf",
    location: "Dhanmondi, Dhaka",
    price: 1200,
    image: "https://png.pngtree.com/thumb_back/fh260/background/20250319/pngtree-football-soccer-stadium-top-view-crowdy-atmosphere-image_17105890.jpg"
  },
  {
    _id: 2,
    name: "City Sports Arena",
    location: "Gulshan, Dhaka",
    price: 1500,
    image: "https://en.reformsports.com/oxegrebi/2020/09/mini-futbol-sahasi-ozellikleri-ve-olculeri.jpg"
  },
  {
    _id: 3,
    name: "City Sports Arena",
    location: "Gulshan, Dhaka",
    price: 3500,
    image: "https://www.greaterkashmir.com/wp-content/uploads/2024/03/ball-badmenton.jpg"
  }
];



const TurfList = () => {
  return (
    <div className="w-full max-w-7xl mx-auto mt-7 px-4">
      {/* Title */}
      <h2 className="text-4xl md:text-6xl font-bold text-center mb-4 text-green-700">
        Turf <span className="italic text-yellow-500">List</span>
      </h2>
      <p className="text-lg leading-7  text-gray-500 italic text-center px-3 md:w-2/3 mx-auto  w-full mb-10">Lorem ipsum dolor sit amet consectetur adipisicing elit. Et dolor dignissimos odio exercitationem eveniet autem perferendis ea cum quidem explicabo!</p>

      {/* Turf Cards */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {turfs.map((turf) => (
          <div
            key={turf._id}
            className="bg-white shadow-lg rounded-md overflow-hidden hover:shadow-2xl transition border"
          >
            {/* Turf Image */}
            <img
              src={turf.image}
              alt={turf.name}
              className="w-full h-52 object-cover"
            />

            {/* Turf Info */}
            <div className="p-5 space-y-3">
              <h3 className="text-xl font-semibold text-gray-800">{turf.name}</h3>
              <p className="text-gray-600 text-sm">{turf.location}</p>
              <p className="text-green-700 font-bold">৳ {turf.price} / hour</p>

              {/* Details Button */}
            <div className="flex gap-x-4 justify-between">
                  <Link className="flex-1" to={`/turf/${turf._id}`}>
                <button className="w-full mt-2 border-green-600 border text-green-600 py-2 rounded transition">
                 Book Now
                </button>
              </Link>
                <Link className="flex-1" to={`/turf/${turf._id}`}>
                <button className="w-full mt-2 bg-gradient-to-r from-green-600 to-green-700 hover:bg-green-700 text-white py-2 rounded transition">
                  View Details
                </button>
              </Link>
            </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TurfList;
