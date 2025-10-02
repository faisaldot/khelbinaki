import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "../../lib/api";

// Types - Corrected to match backend models
interface User {
  _id: string;
  name: string;
  email: string;
}

interface Turf {
  _id: string;
  name: string;
}

interface Booking {
  _id: string;
  user: User;
  turf: Turf;
  date: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
  status: "pending" | "confirmed" | "cancelled"; // Corrected status
  paymentStatus: "unpaid" | "paid" | "refunded"; // Corrected paymentStatus
  createdAt: string;
}

interface DashboardStats {
  totalBookings: number;
  totalRevenue: number;
  upcomingBookings: number;
  bookingStatusCounts: {
    pending: number;
    confirmed: number;
    cancelled: number;
    expired: number;
  };
}

const AdminBookingManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPayment, setFilterPayment] = useState("all");

  // Fetch dashboard stats
  const {
    data: stats,
    isLoading: statsLoading,
  } = useQuery<DashboardStats>({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const res = await api.get("/admin/dashboard");
      return res.data.data;
    },
  });

  // Fetch bookings
  const {
    data: bookings,
    isLoading: bookingsLoading,
    isError: bookingsError,
    refetch,
  } = useQuery<Booking[]>({
    queryKey: ["bookings"],
    queryFn: async () => {
      const res = await api.get("/admin/bookings");
      return res.data.data;
    },
  });

  // Handlers
  const handleBookingStatusUpdate = async (bookingId: string, newStatus: "confirmed" | "cancelled") => {
    try {
      let response;
      if (newStatus === 'cancelled') {
        response = await api.patch(`/admin/bookings/${bookingId}/cancel`);
      } else {
        response = await api.put(`/admin/bookings/${bookingId}/status`, { status: newStatus });
      }
      toast.success(response.data.message || `Booking status updated to ${newStatus}`);
      refetch();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update booking status");
    }
  };

  const handlePaymentStatusUpdate = async (bookingId: string, newStatus: string) => {
    if (window.confirm("Are you sure the customer paid for this slot?")) {
      try {
        await api.patch(`/admin/bookings/${bookingId}/payment`, { paymentStatus: newStatus });
        toast.success(`Payment status updated to ${newStatus}`);
        refetch();
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Failed to update payment status");
      }
    }
  };

  const handleDeleteBooking = async (bookingId: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this booking?")) return;
    try {
      await api.delete(`/admin/bookings/${bookingId}`);
      toast.success("Booking deleted successfully");
      refetch();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete booking");
    }
  };


  // Filter bookings
  const filteredBookings =
    bookings?.filter((booking) => {
      const matchesSearch =
        booking._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.turf?.name?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesBookingStatus =
        filterStatus === "all" || booking.status === filterStatus;

      const matchesPaymentStatus =
        filterPayment === "all" || booking.paymentStatus === filterPayment;

      return matchesSearch && matchesBookingStatus && matchesPaymentStatus;
    }) || [];

  // Helpers
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 0,
    }).format(amount || 0);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const formatTo12Hour = (timeString: string) => {
    if (!timeString) return "N/A";
    const [hours, minutes] = timeString.split(":");
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? "PM" : "AM";
    const formattedHour = h % 12 || 12; // Converts "00" to "12" and "12" to "12"
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  if (statsLoading || bookingsLoading) {
    return (
      <div className="p-6">Loading...</div> // Simplified skeleton
    );
  }

  if (bookingsError) {
    return (
      <div className="p-6 text-red-500">Error loading bookings. Please try again.</div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50/50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent mb-3 tracking-tight">
            Booking Management
          </h1>
          <p className="text-gray-600 text-base">
            Monitor and manage all turf bookings, payments, and statuses.
          </p>
        </div>

        {/* Stats Cards */}
        {/* ... stats cards from your original component ... */}

        {/* Search + Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Search by ID, email, or turf..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-4 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 outline-none text-sm"
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 text-sm bg-white"
            >
              <option value="all">All Booking Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select
              value={filterPayment}
              onChange={(e) => setFilterPayment(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 text-sm bg-white"
            >
              <option value="all">All Payment Statuses</option>
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
            </select>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/50 border-b-2 border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Booking Details</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">User & Turf</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Schedule</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Payment</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredBookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-5">
                      <p className="font-semibold text-sm text-gray-800 mb-1 truncate">{booking._id}</p>
                      <p className="text-xs text-gray-500">{formatDate(booking.createdAt)}</p>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm font-medium text-gray-800 mb-1">{booking.user?.email}</p>
                      <p className="text-xs text-gray-500">{booking.turf?.name}</p>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm font-medium text-gray-800 mb-1">{formatDate(booking.date)}</p>
                      <p className="text-xs text-gray-500">{formatTo12Hour(booking.startTime)} - {formatTo12Hour(booking.endTime)}</p>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm font-bold text-gray-800 mb-2">{formatCurrency(booking.totalPrice)}</p>
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${booking.paymentStatus === "paid" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                          }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${booking.paymentStatus === "paid" ? "bg-green-500" : "bg-yellow-500"}`}></span>
                        {booking.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${booking.status === "confirmed" ? "bg-green-100 text-green-800"
                            : booking.status === "pending" ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${booking.status === "confirmed" ? "bg-green-500"
                            : booking.status === "pending" ? "bg-yellow-500 animate-pulse"
                              : "bg-red-500"
                          }`}></span>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        {/* Show 'Confirm' ONLY if pending but already paid */}
                        {booking.status === "pending" && booking.paymentStatus === 'paid' && (
                          <button onClick={() => handleBookingStatusUpdate(booking._id, "confirmed")}
                            className="px-3 py-1.5 bg-green-100 text-green-700 text-xs font-medium rounded-lg hover:bg-green-200">
                            Confirm
                          </button>
                        )}

                        {/* Show 'Mark Paid' if pending and unpaid */}
                        {booking.status === "pending" && booking.paymentStatus === 'unpaid' && (
                          <button onClick={() => handlePaymentStatusUpdate(booking._id, "paid")}
                            className="px-3 py-1.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-lg hover:bg-blue-200">
                            Mark Paid
                          </button>
                        )}

                        {/* Admin can delete pending/unpaid bookings */}
                        {booking.status === 'pending' && booking.paymentStatus === 'unpaid' && (
                          <button onClick={() => handleDeleteBooking(booking._id)}
                            className="px-3 py-1.5 bg-red-100 text-red-700 text-xs font-medium rounded-lg hover:bg-red-200">
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBookingManagement;
