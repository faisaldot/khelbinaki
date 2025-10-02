import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import api from "../../lib/api";
import { usePayment } from "../../Hooks/api/usePayment";
import { toast } from "sonner";

// Define a type for the booking object for better type safety
interface Booking {
  _id: string;
  turf: {
    name: string;
    location: {
      address: string;
      city: string;
    };
  };
  date: string;
  dayType: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
  paymentStatus: 'unpaid' | 'paid';
  status: 'pending' | 'confirmed' | 'cancelled';
}

const MyBookings = () => {
  const queryClient = useQueryClient();
  const { initPayment } = usePayment();

  // FIX 1: State to track which specific booking is being processed
  const [processingBookingId, setProcessingBookingId] = useState<string | null>(null);

  const { data: bookings = [], isLoading, isError } = useQuery<Booking[]>({
    queryKey: ["my-bookings"],
    queryFn: async () => {
      const res = await api.get("/bookings/my-bookings");
      return res.data?.data;
    },
  });

  const cancelMutation = useMutation({
    mutationFn: (bookingId: string) => {
      // This now correctly points to the new user-facing endpoint
      return api.patch(`/bookings/${bookingId}/cancel`);
    },
    onSuccess: () => {
      toast.success("Booking cancelled successfully!");
      queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || "Failed to cancel booking.";
      toast.error(errorMessage);
    },
  });

  const handleRetryPayment = async (bookingId: string) => {
    // FIX 1: Set the ID of the booking being processed
    setProcessingBookingId(bookingId);
    try {
      // The usePayment hook will handle the API call
      await initPayment(bookingId);
    } catch (error) {
      console.error("Payment initiation failed", error);
      // If the payment hook doesn't handle the error toast, you can add one here
    } finally {
      // FIX 1: Clear the processing ID when done.
      // The page will redirect on success, so this primarily helps on failure.
      setProcessingBookingId(null);
    }
  };

  const handleCancelBooking = (bookingId: string) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      cancelMutation.mutate(bookingId);
    }
  };

  const getStatusBadge = (status: string) => (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        status === "confirmed"
          ? "bg-emerald-100 text-emerald-800"
          : status === "pending"
          ? "bg-yellow-100 text-yellow-800"
          : "bg-red-100 text-red-800"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
          status === "confirmed"
            ? "bg-emerald-400"
            : status === "pending"
            ? "bg-yellow-400"
            : "bg-red-400"
        }`}
      ></span>
      {status}
    </span>
  );

  if (isLoading) {
    return <p className="text-center py-10">Loading bookings...</p>;
  }

  if (isError) {
    return <p className="text-center text-red-500 py-10">Failed to load bookings</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="my-10">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            My Bookings
          </h1>
          <p className="text-gray-600">Track and manage your turf reservations</p>
          <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
            <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
            {bookings?.length} Total Bookings
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 text-white">
                  <th className="px-6 py-4 text-left text-sm font-semibold">Turf</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Date & Time</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Price</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Payment</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bookings?.map((booking) => {
                  const isCurrentlyProcessing = processingBookingId === booking._id;
                  return (
                    <tr key={booking._id} className="hover:bg-emerald-50/50 transition-colors duration-200">
                      <td className="px-6 py-4">
                        <div>
                          <h3 className="font-semibold text-gray-900">{booking?.turf?.name}</h3>
                          <p className="text-sm text-gray-500">
                            {booking?.turf?.location?.address}, {booking?.turf?.location?.city}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600">
                          {new Date(booking?.date).toLocaleDateString()} ({booking?.dayType})
                        </p>
                        <p className="text-xs text-gray-500">
                          {booking?.startTime} - {booking?.endTime}
                        </p>
                      </td>
                      <td className="px-6 py-4 font-bold text-emerald-600">
                        ৳{booking.totalPrice}
                      </td>
                      <td className="px-6 py-4 capitalize">{booking?.paymentStatus}</td>
                      <td className="px-6 py-4">{getStatusBadge(booking?.status)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {booking.status === "pending" && booking.paymentStatus === "unpaid" && (
                            <button
                              onClick={() => handleRetryPayment(booking._id)}
                              disabled={isCurrentlyProcessing || (processingBookingId !== null && !isCurrentlyProcessing)}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                              {isCurrentlyProcessing ? "Processing..." : "Pay Now"}
                            </button>
                          )}
                          {/* FIX 2: Only show cancel button for pending bookings */}
                          {booking.status === "pending" && (
                            <button
                              onClick={() => handleCancelBooking(booking._id)}
                              disabled={cancelMutation.isPending}
                              className="px-3 py-2 bg-red-100 text-red-700 text-xs font-medium rounded-lg hover:bg-red-200"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden space-y-4">
          {bookings.map((booking: any) => {
            const isCurrentlyProcessing = processingBookingId === booking._id;
            return (
              <div
                key={booking._id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-gray-900">{booking?.turf?.name}</h3>
                  {getStatusBadge(booking.status)}
                </div>
                <p className="text-sm text-gray-500">
                  {booking?.turf?.location?.address}, {booking?.turf?.location?.city}
                </p>
                <div className="mt-3 text-sm space-y-1">
                  <p><strong>Date:</strong> {new Date(booking.date).toLocaleDateString()} ({booking.dayType})</p>
                  <p><strong>Time:</strong> {booking.startTime} - {booking.endTime}</p>
                  <p><strong>Price:</strong> ৳{booking.totalPrice}</p>
                  <p><strong>Payment:</strong> {booking.paymentStatus}</p>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
                  {booking.status === "pending" && booking.paymentStatus === "unpaid" && (
                    <button
                      onClick={() => handleRetryPayment(booking._id)}
                      disabled={isCurrentlyProcessing || (processingBookingId !== null && !isCurrentlyProcessing)}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:bg-gray-400"
                    >
                      {isCurrentlyProcessing ? "Processing..." : "Pay Now"}
                    </button>
                  )}
                  {booking.status === "pending" && (
                    <button
                      onClick={() => handleCancelBooking(booking._id)}
                      disabled={cancelMutation.isPending}
                      className="flex-1 px-3 py-2 bg-red-100 text-red-700 text-sm font-medium rounded-lg hover:bg-red-200"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {bookings.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No bookings yet</h3>
            <p className="text-gray-600">Your turf reservations will appear here once you book.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
