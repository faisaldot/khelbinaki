import { Link } from "react-router";
import { TurfCardSkeleton } from "./TurfCardSkeleton";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MapPin, Star, Calendar, Users, Zap, Search, Filter, MoveRight, PanelBottom, ArrowBigDownDash } from "lucide-react";
import api from "../lib/api";
import type { ApiResponse, Turf } from "../types/api.types";

const TurfList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState("all");

  const { data, isLoading, error } = useQuery({
    queryKey: ["turfs", page],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Turf[]>>("/turfs", {
        params: { page, limit: 12, search: searchQuery },
      });
      return response.data;
    },
  });

  const getAmenityIcon = (amenity) => {
    const icons = {
      'WiFi': '📶',
      'Wifi': '📶',
      'Floodlights': '💡',
      'Parking': '🚗',
      'Changing Room': '🚿',
      'Gallery': '👥',
      'Security': '🛡️'
    };
    return icons[amenity] || '✨';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50/30">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <TurfCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50/30 flex items-center justify-center">
        <div className="text-center p-12 bg-white rounded-3xl shadow-2xl border border-red-100 max-w-md mx-auto">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Oops! Something went wrong</h3>
          <p className="text-gray-600 mb-8">We couldn't load the turfs. Please try again.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50/30">
      {/* Hero Section */}
     
      {/* Turf Cards Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">

        {/* Turf Cards Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {data?.data?.map((turf) => (
           <div
  key={turf._id}
  className="group relative bg-white rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-green-200 hover:scale-[1.02] transform flex flex-col h-full"
>
  {/* Image Container with Overlay */}
  <div className="relative h-56 overflow-hidden">
    <img
      src={
        turf.images?.[0] || 
        "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=600&fit=crop"
      }
      alt={turf.name}
      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
    />
    
    {/* Gradient Overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
    
    {/* Price Badge */}
    <div className="absolute top-4 right-4 bg-gradient-to-r from-green-600 via-green-700 to-green-800 text-white text-sm px-3 py-1.5 rounded-full font-bold shadow-lg">
      ৳{turf.defaultPricePerSlot}/hr
    </div>

    {/* Location */}
    <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white">
      <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
        <MapPin className="w-4 h-4" />
      </div>
      <span className="font-medium">
        {turf.location.address}, {turf.location.city}
      </span>
    </div>
  </div>

  {/* Content */}
  <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
    <div>
      {/* Title */}
      <div className="flex justify-between items-start">
        <h3 className="text-xl font-bold text-gray-800 group-hover:text-green-600 transition-colors line-clamp-1">
          {turf.name}
        </h3>
        <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg"></div>
      </div>

      {/* Features */}
      <div className="flex items-center justify-between text-sm text-gray-500 mt-2">
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          <span>Available Today</span>
        </div>
      </div>

      {/* Amenities */}
      <div className="flex flex-wrap gap-2 mt-3">
        {turf.amenities.slice(0, 3).map((amenity) => (
          <div
            key={amenity}
            className="flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium border border-green-100"
          >
            <span>{getAmenityIcon(amenity)}</span>
            <span>{amenity}</span>
          </div>
        ))}
        {turf.amenities.length > 3 && (
          <div className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
            +{turf.amenities.length - 3} more
          </div>
        )}
      </div>
    </div>

    {/* Button */}
    <Link to={`/turfs/${turf?.slug}`} className="block mt-4">
      <button className="w-full bg-gradient-to-r from-green-600 via-green-700 to-green-800 text-white py-2 rounded font-semibold  hover:from-green-700 hover:via-green-800 hover:to-green-900 transform hover:scale-[1.02] hover:shadow-lg transition-all duration-300 group-hover:shadow-xl">
        <span className="flex items-center justify-center gap-2">
          View Details & Book
          <svg
            className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </span>
      </button>
    </Link>
  </div>

  {/* Hover Glow */}
  <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-green-400/0 to-blue-400/0 group-hover:from-green-400/10 group-hover:to-blue-400/10 transition-all duration-500 pointer-events-none"></div>
</div>

          ))}
        </div>

        {/* Empty State */}
        {data?.data?.length === 0 && (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">No turfs found</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              We couldn't find any turfs matching your search. Try adjusting your filters or search terms.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedFilter("all");
              }}
              className="px-8 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Load More Button */}
        {data?.data && data.data.length > 0 && (
          <div className="text-center mt-16">
            <button
              onClick={() => setPage(prev => prev + 1)}
              className="px-8 py-3 bg-white text-green-600 border-2 border-green-600 rounded-2xl font-semibold hover:bg-green-600 hover:text-white transform hover:scale-105 transition-all duration-300 shadow-lg flex justify-center items-center mx-auto hover:shadow-xl gap-x-4"
            >
              Load More Turfs   <ArrowBigDownDash/>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TurfList;