/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, Link } from "react-router";
import { MapPin, Clock, Calendar as CalendarIcon, ChevronDown, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import type { ApiResponse, Turf, ApiError, CreateBookingData, Booking, TurfAvailability, AvailabilitySlot } from "../types/api.types";
import api from "../lib/api";
import { PageLoader } from "./PlaceHolder";
import { useAuth } from "../Hooks/useAuth";
import { usePayment } from "../Hooks/api/usePayment";

export interface CalendarProps {
  selected: Date;
  onSelect: (date: Date) => void;
  className?: string;
  disabled?: (a?: any) => boolean; // default true, but can toggle
}


// Simple Calendar Component
const Calendar = ({ selected, onSelect, disabled = () => false, className = "" }: CalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const today = new Date();
  
const getDaysInMonth = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  const firstDayWeek = firstDay.getDay(); // 0 (Sun) → 6 (Sat)
  const daysInMonth = lastDay.getDate();

  const days: { date: Date; isCurrentMonth: boolean }[] = [];

  // Previous month's days
  if (firstDayWeek > 0) {
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = firstDayWeek - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthLastDay - i),
        isCurrentMonth: false,
      });
    }
  }

  // Current month's days
  for (let day = 1; day <= daysInMonth; day++) {
    days.push({
      date: new Date(year, month, day),
      isCurrentMonth: true,
    });
  }

  // Next month's days to fill grid (always 6 weeks → 42 cells)
  const remainingDays = 42 - days.length;
  for (let day = 1; day <= remainingDays; day++) {
    days.push({
      date: new Date(year, month + 1, day),
      isCurrentMonth: false,
    });
  }

  return days;
};


  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return date1?.toDateString() === date2?.toDateString();
  };

  const isToday = (date: Date) => {
    return isSameDay(date, today);
  };

 const isPast = (date: Date) => {
  const now = new Date(); // always fresh "today"
  const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const todayOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  return dateOnly < todayOnly; // strictly less, so today is NOT disabled
};
  const days = getDaysInMonth(currentDate);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          ←
        </button>
        <h3 className="font-semibold text-gray-800">
          {formatDate(currentDate)}
        </h3>
        <button
          onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          →
        </button>
      </div>

      {/* Week days */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 p-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar days */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          const isDisabled = disabled(day.date) || isPast(day.date);
          const isSelected = isSameDay(selected, day.date);
          const isTodayDate = isToday(day.date);
          
          return (
            <button
              key={index}
              onClick={() => !isDisabled && day.isCurrentMonth && onSelect(day.date)}
              disabled={isDisabled}
              className={`
                p-2 text-sm rounded-lg transition-colors
                ${!day.isCurrentMonth ? 'text-gray-300' : ''}
                ${isSelected ? 'bg-green-600 text-white' : ''}
                ${isTodayDate && !isSelected ? 'bg-blue-100 text-blue-600 font-semibold' : ''}
                ${isDisabled ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-gray-100'}
                ${day.isCurrentMonth && !isDisabled && !isSelected ? 'text-gray-700' : ''}
              `}
            >
              {day.date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const TurfDetails = () => {
  const { slug } = useParams();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [showTimeSlots, setShowTimeSlots] = useState(false);

  const { isAuthenticated } = useAuth();
  const { initPaymentAsync, isLoading: isPaymentLoading } = usePayment();
  const queryClient = useQueryClient();

  // Helper functions - All defined at top to avoid hoisting issues
  const getCurrentDayType = (date: Date) => {
    const day = new Date(date).getDay();
    return (day === 5 || day === 6) ? 'friday-saturday' : 'sunday-thursday';
  };

  const formatTime = (time: string) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getAmenityIcon = (amenity: string) => {
    const icons = {
      'Floodlights': '💡',
      'Parking': '🚗',
      'Changing Room': '🚿',
      'Gallery': '👥',
      'Wifi': '📶',
      'WiFi': '📶',
      'Security': '🛡️'
    };
    return icons[amenity] || '✅';
  };

  // BUG FIX 1: Check if time slot has already passed for today's date
  const isTimeSlotPassed = (startTime, selectedDate) => {
    const today = new Date();
    const selectedDateStr = selectedDate.toDateString();
    const todayStr = today.toDateString();
    
    // If selected date is not today, no need to check time
    if (selectedDateStr !== todayStr) {
      return false;
    }
    
    // If it's today, check if the time slot has passed
    const currentHour = today.getHours();
    const currentMinutes = today.getMinutes();
    const currentTotalMinutes = currentHour * 60 + currentMinutes;
    
    const [slotHour, slotMinutes] = startTime.split(':').map(Number);
    const slotTotalMinutes = slotHour * 60 + slotMinutes;
    
    return slotTotalMinutes <= currentTotalMinutes;
  };

  // Queries
  const { data, isLoading, error } = useQuery({
    queryKey: ["turfDetails", slug],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Turf>>(`/turfs/${slug}`);
      return response.data;
    },
    enabled: !!slug,
  });

  // Query to fetch turf availability with proper refetch
  const { data: availability, isLoading: isAvailabilityLoading, refetch: refetchAvailability } = useQuery({
    queryKey: ["turf-availability", data?.data?._id, selectedDate?.toDateString()],
    queryFn: async () => {
      if (!selectedDate || !data?.data?._id) return null;
      const dateStr = selectedDate.toISOString().split("T")[0];
      const response = await api.get<ApiResponse<TurfAvailability>>(
        `/turfs/${data.data._id}/availability`,
        { params: { date: dateStr } }
      );
      return response.data.data;
    },
    enabled: !!selectedDate && !!data?.data?._id,
    refetchOnWindowFocus: true,
    staleTime: 0, // Always consider data stale for real-time updates
    cacheTime: 0, // Don't cache availability data
  });

  // Effect to refetch availability when selectedDate changes
  useEffect(() => {
    if (selectedDate && data?.data?._id) {
      refetchAvailability();
    }
  }, [selectedDate, data?.data?._id, refetchAvailability]);

  // Mutation to create a new booking
  const bookingMutation = useMutation({
    mutationFn: async (data: CreateBookingData): Promise<Booking> => {
      console.log("Making booking API call with:", data);
      const response = await api.post<ApiResponse<Booking>>("/bookings", data);
      console.log("Booking API response:", response.data);

      // Try different possible response structures
      return (
        response.data.data ||
        (response.data as any).booking ||
        (response.data as any)
      );
    },
    onError: (error: AxiosError<ApiError>) => {
      console.error("Booking mutation error:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to create booking.";
      toast.error(errorMessage);
    },
  });

  // Get price for specific time based on pricing rules
  const getPriceForTime = (time, dateForPrice = selectedDate) => {
    if (!data?.data?.pricingRules) return data?.data?.defaultPricePerSlot || 2000;
    
    const dayType = getCurrentDayType(dateForPrice);
    const rule = data.data.pricingRules.find(r => r.dayType === dayType);
    
    if (!rule) return data?.data?.defaultPricePerSlot || 2000;
    
    const timeHour = parseInt(time.split(':')[0]);
    
    // Find which pricing slot this time falls into
    for (const slot of rule.timeSlots) {
      const startHour = parseInt(slot.startTime.split(':')[0]);
      const endHour = parseInt(slot.endTime.split(':')[0]);
      
      if (timeHour >= startHour && timeHour < endHour) {
        return slot.pricePerSlot;
      }
    }
    
    return data?.data?.defaultPricePerSlot || 2000;
  };

  // Generate hourly time slots based on operating hours
  const generateTimeSlots = () => {
    if (!data?.data) return [];
    
    const { start, end } = data.data.operatingHours;
    const slots = [];
    
    const startHour = parseInt(start.split(':')[0]);
    const endHour = parseInt(end.split(':')[0]);
    
    for (let hour = startHour; hour < endHour; hour++) {
      const startTime = `${String(hour).padStart(2, '0')}:00`;
      const endTime = `${String(hour + 1).padStart(2, '0')}:00`;
      
      // BUG FIX 1: Check if time slot has passed for today
      const hasPassedTime = isTimeSlotPassed(startTime, selectedDate);
      
      slots.push({
        startTime,
        endTime,
        pricePerSlot: getPriceForTime(startTime, selectedDate),
        isAvailable: !hasPassedTime, // Mark as unavailable if time has passed
        isTimePassed: hasPassedTime
      });
    }
    
    return slots;
  };

  // BUG FIX 2: Enhanced availability check with proper backend data handling
  const getAvailableTimeSlots = () => {
    const allSlots = generateTimeSlots();
    
    if (!availability?.slots) {
      // If no backend data, just return slots with time-based availability
      return allSlots;
    }
    
    // Update availability based on backend data AND time check
    return allSlots.map(slot => {
      const backendSlot = availability.slots.find(
        (availSlot: AvailabilitySlot) => availSlot.startTime === slot.startTime
      );
      
      // A slot is available only if:
      // 1. It hasn't passed the current time (for today)
      // 2. Backend says it's available (not booked)
      const isBackendAvailable = backendSlot?.isAvailable ?? true;
      const finalAvailability = !slot.isTimePassed && isBackendAvailable;
      
      return {
        ...slot,
        isAvailable: finalAvailability,
        pricePerSlot: backendSlot?.pricePerSlot ?? slot.pricePerSlot,
        isBooked: backendSlot ? !backendSlot.isAvailable : false
      };
    });
  };

  const handleBooking = async () => {
    if (!selectedTimeSlot || !data?.data) return;

    // Additional check before booking
    if (isTimeSlotPassed(selectedTimeSlot.startTime, selectedDate)) {
      toast.error("This time slot has already passed. Please select a future time.");
      setSelectedTimeSlot(null);
      return;
    }

    try {
      const bookingData = {
        turf: data.data._id,
        date: selectedDate,
        startTime: selectedTimeSlot.startTime,
        endTime: selectedTimeSlot.endTime,
      };

      console.log("Submitting booking data:", bookingData);

      // First, create the booking
      const booking = await bookingMutation.mutateAsync(bookingData);
      console.log("Booking response:", booking);

      const bookingId = booking._id;

      if (bookingId) {
        toast.success("Booking created successfully. Redirecting to payment...");

        // Reset UI state immediately
        setSelectedTimeSlot(null);
        setShowTimeSlots(false);

        // Force refetch availability data
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: ["turfDetails", slug],
          }),
          queryClient.invalidateQueries({
            queryKey: ["turf-availability", data.data._id, selectedDate?.toDateString()],
          })
        ]);

        // Manually refetch to ensure immediate update
        await refetchAvailability();

        console.log("Initializing payment for booking ID:", bookingId);
        await initPaymentAsync(bookingId);
      } else {
        toast.error("Booking created but no booking ID received");
        console.error("Invalid booking response:", booking);
      }
    } catch (error) {
      console.error("Booking or payment initialization failed:", error);
      // Reset UI state on error
      setSelectedTimeSlot(null);
      setShowTimeSlots(false);
    }
  };

  const isFormLoading = bookingMutation.isPending || isPaymentLoading || isAvailabilityLoading;
  const availableSlots = getAvailableTimeSlots();
  // Filter only available slots for showing in dropdown
  const availableSlotsOnly = availableSlots.filter(slot => slot.isAvailable);

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
          {/* Right Column - Booking Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              {!isAuthenticated ? (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                      <CalendarIcon className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Ready to Book?</h3>
                    <p className="text-gray-600 mb-6">You must be logged in to make a booking.</p>
                    <Link to="/auth/login" className="inline-block w-full bg-gradient-to-r from-green-600 via-green-700 to-green-800 text-white py-4 rounded-xl font-bold text-lg hover:from-green-700 hover:via-green-800 hover:to-green-900 transform hover:scale-105 hover:shadow-xl transition-all duration-300 text-center">
                      Log In to Book
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                    Book Your Slot
                  </h3>

                  {/* Date Selection with Calendar */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Select Date
                    </label>
                    <Calendar
                      selected={selectedDate}
                      onSelect={(date) => {
                        setSelectedDate(date);
                        setSelectedTimeSlot(null);
                        setShowTimeSlots(false);
                        // Immediately refetch availability for new date
                        setTimeout(() => refetchAvailability(), 100);
                      }}
                      disabled={(date) => date < new Date()}
                      className="w-full"
                    />
                  </div>

                  {/* Time Slot Selection */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Select Time Slot
                      {isAvailabilityLoading && (
                        <span className="ml-2 text-xs text-gray-500">(Loading availability...)</span>
                      )}
                    </label>
                    <div className="relative">
                      <button
                        onClick={() => setShowTimeSlots(!showTimeSlots)}
                        className="w-full flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl hover:border-green-600 focus:border-green-600 focus:ring-4 focus:ring-green-100 transition-all outline-none"
                        disabled={isFormLoading}
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
                          {isAvailabilityLoading ? (
                            <div className="p-4 text-center text-gray-500">
                              <div className="flex items-center justify-center gap-2">
                                <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                                Loading availability...
                              </div>
                            </div>
                          ) : availableSlots.length > 0 ? (
                            availableSlots.map((slot, idx) => {
                              let statusText = '';
                              let statusClass = '';
                              
                              if (slot.isTimePassed) {
                                statusText = '(Time Passed)';
                                statusClass = 'text-red-500';
                              } else if (slot.isBooked) {
                                statusText = '(Booked)';
                                statusClass = 'text-orange-500';
                              } else if (!slot.isAvailable) {
                                statusText = '(Unavailable)';
                                statusClass = 'text-gray-500';
                              }
                              
                              return (
                                <button
                                  key={`${slot.startTime}-${slot.isAvailable}-${slot.isTimePassed}`}
                                  onClick={() => {
                                    if (slot.isAvailable) {
                                      setSelectedTimeSlot(slot);
                                      setShowTimeSlots(false);
                                    }
                                  }}
                                  className={`w-full text-left px-4 py-3 border-b border-gray-100 last:border-b-0 transition-colors ${
                                    slot.isAvailable 
                                      ? 'hover:bg-green-50 cursor-pointer' 
                                      : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                                  }`}
                                  disabled={!slot.isAvailable || isFormLoading}
                                >
                                  <div className="flex justify-between items-center">
                                    <span className={`font-medium ${slot.isAvailable ? 'text-gray-800' : 'text-gray-400'}`}>
                                      {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                                      {statusText && (
                                        <span className={`ml-2 text-xs font-normal ${statusClass}`}>
                                          {statusText}
                                        </span>
                                      )}
                                    </span>
                                    <span className={`font-bold ${slot.isAvailable ? 'text-green-600' : 'text-gray-400'}`}>
                                      ৳{slot.pricePerSlot}
                                    </span>
                                  </div>
                                </button>
                              );
                            })
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
                        <span className="ml-2 text-green-600">
                          ({selectedDate.toLocaleDateString()})
                        </span>
                      </p>
                    </div>
                  )}

                  {/* Book Now Button */}
                  <button
                    onClick={handleBooking}   
                    disabled={!selectedTimeSlot || isFormLoading}
                    className="w-full bg-gradient-to-r from-green-600 via-green-700 to-green-800 text-white py-4 rounded-xl font-bold text-lg hover:from-green-700 hover:via-green-800 hover:to-green-900 transform hover:scale-105 hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-none"
                  >
                    {isFormLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Processing...
                      </div>
                    ) : selectedTimeSlot ? 'Proceed to Payment' : 'Select Time Slot'}
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
              )}
            </div>
          </div>
          
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
                            <span className="md:text-2xl text-lg font-bold text-green-600">৳{slot.pricePerSlot} /hour</span>
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
        </div>
      </div>
    </div>
  );
};

export default TurfDetails;
