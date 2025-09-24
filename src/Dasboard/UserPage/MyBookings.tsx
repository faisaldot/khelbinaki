import { useQuery } from "@tanstack/react-query";
import api from "../../lib/api";

const MyBookings = () => {
  const { data: bookings = [], isLoading, isError } = useQuery({
    queryKey: ["my-bookings"],
    queryFn: async () => {
      const res = await api.get("/bookings/my-bookings")
      return res.data;
    },
  });

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
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bookings?.map((booking: any) => (
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden space-y-4">
          {bookings.map((booking: any) => (
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
                <p>
                  <strong>Date:</strong> {new Date(booking.date).toLocaleDateString()} (
                  {booking.dayType})
                </p>
                <p>
                  <strong>Time:</strong> {booking.startTime} - {booking.endTime}
                </p>
                <p>
                  <strong>Price:</strong> ৳{booking.totalPrice}
                </p>
                <p>
                  <strong>Payment:</strong> {booking.paymentStatus}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {bookings.length === 0 && (
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
