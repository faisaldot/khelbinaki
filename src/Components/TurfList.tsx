import { Link } from "react-router";
import { TurfCardSkeleton } from "./TurfCardSkeleton";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MapPin } from "lucide-react";
import api from "../lib/api";
import type { ApiResponse, Turf } from "../types/api.types";

const TurfList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useQuery({
    queryKey: ["turfs", page],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Turf[]>>("/turfs", {
        params: { page, limit: 12, search: searchQuery },
      });
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 max-w-7xl mx-auto sm:grid-cols-2 lg:grid-cols-3 gap-6 p-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <TurfCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Failed to load turfs</p>
        <button onClick={() => window.location.reload()} className="mt-3 px-4 py-2 bg-green-600 text-white rounded">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto mt-7 px-4">
      {/* Title */}
      <h2 className="text-4xl md:text-6xl font-bold text-center mb-4 text-green-700">
        Turf <span className="italic text-yellow-500">List</span>
      </h2>
      <p className="text-lg leading-7 text-gray-500 italic text-center px-3 md:w-2/3 mx-auto w-full mb-10">
        Browse our premium turfs with top-notch facilities
      </p>

      {/* Turf Cards */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {data?.data?.map((turf) => (
          <div
            key={turf._id}
            className="bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-2xl transition border border-gray-200"
          >
            {/* Turf Image */}
            <img
              src={
                "https://www.shutterstock.com/image-photo/green-grass-field-background-football-600nw-2330372505.jpg"
              }
              alt={turf.name}
              className="w-full h-48 object-cover"
            />

            {/* Turf Info */}
            <div className="p-5 space-y-2">
              <h3 className="text-xl font-semibold text-gray-800">{turf.name}</h3>

              <div className="flex items-center gap-1 text-gray-600 text-sm">
                <MapPin className="w-4 h-4" />
                <span>{turf.location.city}</span>
              </div>

              <p className="text-green-700 font-bold text-lg">
                ৳ {turf.defaultPricePerSlot} / hr
              </p>

              {/* Amenities */}
              <div className="flex flex-wrap gap-2 mt-2">
                {turf.amenities.slice(0, 3).map((amenity) => (
                  <span
                    key={amenity}
                    className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
              {/* Buttons */}

                <Link to={`/turfs/${turf?.slug}`} className="flex-1">
                  <button className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white mt-5 py-2 rounded hover:from-green-700 hover:to-green-800 transition">
                    View Details
                  </button>
                </Link>
              </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default TurfList;
