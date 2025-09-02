import { useState } from "react";
import TurfList from "../Components/TurfList.";
import Container from "../Components/Container";

const Turfs: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState(""); // input value
//   const [location, setLocation] = useState(""); // actual location for search

  const handleSearch = () => {
    // setLocation(searchTerm); // button click করলে location update হবে
  };

  return (
    <Container>
    <div className="p-2">
      {/* Search Section */}
      <div className="flex justify-end items-center py-6 gap-2 mb-6">
        <input
          type="text"
          placeholder="Search by location"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-green-600 px-4 py-2 rounded w-full md:w-2/6"
        />
        <button
          onClick={handleSearch}
          className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2  rounded hover:bg-green-700/20 transition"
        >
          Search
        </button>
      </div>

      {/* Turf List */}
      <TurfList/>
    </div>
    </Container>
  );
};

export default Turfs;
