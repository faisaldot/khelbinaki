import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { MapPin, Clock, Star, Calendar, ChevronDown, Users, Wifi, Car, Shield } from "lucide-react";
import { useState } from "react";
import type { ApiResponse, Turf } from "../types/api.types";
import api from "../lib/api";
import { PageLoader } from "./PlaceHolder";
import axios from "axios";

const TurfDetails = () => {
  const { slug } = useParams();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [showTimeSlots, setShowTimeSlots] = useState(false);


  const { data, isLoading, error } = useQuery({
    queryKey: ["turfDetails", slug],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Turf>>(`/turfs/${slug}`);
      return response.data;
    },
    enabled: !!slug,
  });

  const getAmenityIcon = (amenity) => {
    const icons = {
      'Floodlights': '💡',
      'Parking': '🚗',
      'Changing Room': '🚿',
      'Gallery': '👥',
      'Wifi': '📶',
      'Security': '🛡️'
    };
    return icons[amenity] || '✅';
  };

  const getCurrentDayType = (date) => {
    const day = new Date(date).getDay();
    return (day === 5 || day === 6) ? 'friday-saturday' : 'sunday-thursday';
  };

  const getAvailableTimeSlots = () => {
    if (!data?.data) return [];
    const dayType = getCurrentDayType(selectedDate);
    const rule = data.data.pricingRules.find(r => r.dayType === dayType);
    return rule ? rule.timeSlots : [];
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };




const handleBooking = async () => {
  if (!selectedTimeSlot) return;

  try {
    // 1. Booking Create
    const bookingRes = await api.post("/bookings", {
      turf: turf?._id,
      date: selectedDate,
      startTime: selectedTimeSlot?.startTime,
      endTime: selectedTimeSlot?.endTime,
    });

  const bookingId=bookingRes.data.booking._id;
    // // 2. Payment Init
    const paymentRes = await api.post(`/payments/init/${bookingId}`);
    // // 3. Redirect User to SSLCommerz Payment Page
    console.log(paymentRes.data);
  } catch (err) {
    console.error("Booking/Payment Error:", err);
  }
};




  if (isLoading) return <PageLoader />;

  if (error || !data?.data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center p-8">
          <div className="w-24 h-24 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Turf not found</h1>
          <p className="text-gray-600">The requested turf could not be found.</p>
        </div>
      </div>
    );
  }

  const turf = data.data;
  const availableSlots = getAvailableTimeSlots();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50/30">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="relative mb-12">
          <div className="relative h-96 rounded-3xl overflow-hidden shadow-2xl">
            <img
              src={turf.images?.[0] || "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=1200&h=600&fit=crop"}
              alt={turf.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
            
            {/* Hero Content */}
            <div className="absolute bottom-8 left-8 right-8">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                  <h1 className="text-4xl sm:text-5xl font-bold text-white drop-shadow-lg mb-3">
                    {turf.name}
                  </h1>
                  <div className="flex items-center gap-4 text-white/90">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      <span className="text-lg">{turf.location.address}, {turf.location.city}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                  <div className="text-center">
                    <p className="text-white/80 text-sm mb-1">Starting from</p>
                    <p className="text-3xl font-bold text-white">৳ {turf.defaultPricePerSlot}</p>
                    <p className="text-white/80 text-sm">per hour</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* About Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600">ℹ️</span>
                </div>
                About This Turf
              </h2>
              <p className="text-gray-600 leading-relaxed">{turf.description}</p>
              
              {/* Key Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-semibold text-gray-800">Operating Hours</p>
                      <p className="text-green-700">{formatTime(turf.operatingHours.start)} - {formatTime(turf.operatingHours.end)}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-semibold text-gray-800">Capacity</p>
                      <p className="text-blue-700">Up to 22 players</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Amenities Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600">⚡</span>
                </div>
                Amenities & Features
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {turf.amenities.map((amenity, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-xl p-4 text-center hover:bg-gray-100 transition-colors">
                    <span className="text-2xl block mb-2">{getAmenityIcon(amenity)}</span>
                    <span className="text-sm font-medium text-gray-700">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing Rules */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600">💰</span>
                </div>
                Pricing Structure
              </h3>
              <div className="space-y-6">
                {turf.pricingRules.map((rule, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
                      <h4 className="font-bold text-white capitalize text-lg">
                        {rule.dayType.replace('-', ' to ')}
                      </h4>
                    </div>
                    <div className="p-6">
                      <div className="grid gap-4">
                        {rule.timeSlots.map((slot, slotIdx) => (
                          <div key={slotIdx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                            <div className="flex items-center gap-3">
                              <Clock className="w-5 h-5 text-gray-500" />
                              <span className="font-medium text-gray-800">
                                {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                              </span>
                            </div>
                            <span className="text-2xl font-bold text-green-600">৳{slot.pricePerSlot}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          {/* Gallery Section */}
            {turf.images?.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-purple-600">📸</span>
                  </div>
                  Photo Gallery
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {turf.images.map((img, idx) => (
                    <div key={idx} className="relative group cursor-pointer">
                      <img
                        src={img}
                        alt={`Turf ${idx + 1}`}
                        className="w-full h-48 object-cover rounded-xl shadow-sm group-hover:shadow-lg transition-all duration-300"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded-xl transition-all duration-300"></div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Google Map */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-red-600" />
                </div>
                Location & Directions
              </h3>
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="font-medium text-gray-800 mb-1">Address</p>
                  <p className="text-gray-600">{turf.location.address}, {turf.location.city}</p>
                </div>
                
                {/* Embedded Google Map */}
                <div className="w-full h-64 rounded-xl overflow-hidden shadow-sm">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${turf.location.coordinates?.lat || 23.8103},${turf.location.coordinates?.lng || 90.4125}&zoom=15`}
                    title="Turf Location"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                  Book Your Slot
                </h3>

                {/* Date Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Select Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => {
                        setSelectedDate(e.target.value);
                        setSelectedTimeSlot(null);
                      }}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-600 focus:ring-4 focus:ring-green-100 transition-all outline-none"
                    />
                  </div>
                </div>

                {/* Time Slot Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Select Time Slot
                  </label>
                  <div className="relative">
                    <button
                      onClick={() => setShowTimeSlots(!showTimeSlots)}
                      className="w-full flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl hover:border-green-600 focus:border-green-600 focus:ring-4 focus:ring-green-100 transition-all outline-none"
                    >
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-700">
                          {selectedTimeSlot 
                            ? `${formatTime(selectedTimeSlot.startTime)} - ${formatTime(selectedTimeSlot.endTime)}`
                            : "Choose time slot"
                          }
                        </span>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showTimeSlots ? 'rotate-180' : ''}`} />
                    </button>

                    {showTimeSlots && (
                      <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                        {availableSlots.length > 0 ? (
                          availableSlots.map((slot, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                setSelectedTimeSlot(slot);
                                setShowTimeSlots(false);
                              }}
                              className="w-full text-left px-4 py-3 hover:bg-green-50 border-b border-gray-100 last:border-b-0 transition-colors"
                            >
                              <div className="flex justify-between items-center">
                                <span className="font-medium text-gray-800">
                                  {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                                </span>
                                <span className="font-bold text-green-600">৳{slot.pricePerSlot}</span>
                              </div>
                            </button>
                          ))
                        ) : (
                          <div className="p-4 text-center text-gray-500">
                            No slots available for selected date
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Price Display */}
                {selectedTimeSlot && (
                  <div className="mb-6 p-4 bg-green-50 rounded-xl border border-green-200">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-700">Total Amount:</span>
                      <span className="text-2xl font-bold text-green-600">৳{selectedTimeSlot?.pricePerSlot}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {formatTime(selectedTimeSlot?.startTime)} - {formatTime(selectedTimeSlot?.endTime)} 
                      <span className="ml-2 text-green-600">({getCurrentDayType(selectedDate).replace('-', ' to ')})</span>
                    </p>
                  </div>
                )}

                {/* Book Now Button */}
                <button
                      onClick={handleBooking}   
                  disabled={!selectedTimeSlot}
                  className="w-full bg-gradient-to-r from-green-600 via-green-700 to-green-800 text-white py-4 rounded-xl font-bold text-lg hover:from-green-700 hover:via-green-800 hover:to-green-900 transform hover:scale-105 hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-none"
                >
                  {selectedTimeSlot ? 'Proceed to Payment' : 'Select Time Slot'}
                </button>

                {/* Contact Info */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-600 text-center mb-3">Need help? Contact us</p>
                  <div className="flex justify-center gap-4">
                    <button className="p-3 bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                    </button>
                    <button className="p-3 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TurfDetails;