import { useState, useEffect } from "react";
import { toast } from "sonner";

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPayment, setFilterPayment] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // Simulate API call with dummy data
  useEffect(() => {
    const loadBookings = setTimeout(() => {
      setBookings([
        {
          _id: "BK001",
          bookingId: "TRF-2024-001",
          userEmail: "john.doe@email.com",
          turfName: "Green Field Arena",
          date: "2024-12-25",
          timeSlot: "10:00 AM - 12:00 PM",
          duration: "2 hours",
          paymentAmount: 2500,
          paymentStatus: "paid",
          bookingStatus: "confirmed",
          createdAt: "2024-12-20T10:30:00Z"
        },
        {
          _id: "BK002",
          bookingId: "TRF-2024-002",
          userEmail: "sarah.wilson@email.com",
          turfName: "Blue Star Sports",
          date: "2024-12-26",
          timeSlot: "2:00 PM - 4:00 PM",
          duration: "2 hours",
          paymentAmount: 3000,
          paymentStatus: "pending",
          bookingStatus: "pending",
          createdAt: "2024-12-21T14:15:00Z"
        },
        {
          _id: "BK003",
          bookingId: "TRF-2024-003",
          userEmail: "mike.johnson@email.com",
          turfName: "Victory Ground",
          date: "2024-12-24",
          timeSlot: "6:00 PM - 8:00 PM",
          duration: "2 hours",
          paymentAmount: 2800,
          paymentStatus: "paid",
          bookingStatus: "completed",
          createdAt: "2024-12-19T16:45:00Z"
        },
        {
          _id: "BK004",
          bookingId: "TRF-2024-004",
          userEmail: "emma.davis@email.com",
          turfName: "Champion Field",
          date: "2024-12-27",
          timeSlot: "8:00 AM - 10:00 AM",
          duration: "2 hours",
          paymentAmount: 2200,
          paymentStatus: "failed",
          bookingStatus: "cancelled",
          createdAt: "2024-12-22T08:20:00Z"
        },
        {
          _id: "BK005",
          bookingId: "TRF-2024-005",
          userEmail: "alex.brown@email.com",
          turfName: "Elite Sports Complex",
          date: "2024-12-28",
          timeSlot: "4:00 PM - 6:00 PM",
          duration: "2 hours",
          paymentAmount: 3500,
          paymentStatus: "paid",
          bookingStatus: "confirmed",
          createdAt: "2024-12-23T12:10:00Z"
        },
        {
          _id: "BK006",
          bookingId: "TRF-2024-006",
          userEmail: "lisa.garcia@email.com",
          turfName: "Premier League Ground",
          date: "2024-12-29",
          timeSlot: "7:00 PM - 9:00 PM",
          duration: "2 hours",
          paymentAmount: 4000,
          paymentStatus: "pending",
          bookingStatus: "pending",
          createdAt: "2024-12-23T19:30:00Z"
        }
      ]);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(loadBookings);
  }, []);

  // Handlers
  const handleBookingStatusUpdate = (bookingId, newStatus) => {
    setBookings(prev => prev.map(booking => 
      booking._id === bookingId 
        ? { ...booking, bookingStatus: newStatus }
        : booking
    ));
    toast.success(`Booking status updated to ${newStatus}`);
  };

  const handlePaymentStatusUpdate = (bookingId, newStatus) => {
    setBookings(prev => prev.map(booking => 
      booking._id === bookingId 
        ? { ...booking, paymentStatus: newStatus }
        : booking
    ));
    toast.success(`Payment status updated to ${newStatus}`);
  };

  const handleDeleteBooking = (bookingId) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      setBookings(prev => prev.filter(booking => booking._id !== bookingId));
      toast.success("Booking deleted successfully");
    }
  };

  // Filter bookings
  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking?.bookingId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking?.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking?.turfName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesBookingStatus =
      filterStatus === "all" || booking?.bookingStatus === filterStatus;
    
    const matchesPaymentStatus =
      filterPayment === "all" || booking?.paymentStatus === filterPayment;

    return matchesSearch && matchesBookingStatus && matchesPaymentStatus;
  });

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Loading Skeleton
  const BookingsSkeleton = () => (
    <div className="p-6 min-h-screen bg-gradient-to-br from-white to-gray-50/30">
      <div className="max-w-7xl mx-auto">
        <div className="h-8 w-64 bg-gray-200 rounded-lg animate-pulse mb-2"></div>
        <div className="h-4 w-96 bg-gray-200 rounded animate-pulse mb-8"></div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-4 border-b border-gray-100"
            >
              <div className="flex-1">
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-3 w-48 bg-gray-200 rounded animate-pulse mb-1"></div>
                <div className="h-3 w-40 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (isLoading) return <BookingsSkeleton />;

  if (isError) {
    return (
      <div className="p-6 min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01M6 18h12M6 6h12"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Failed to Load Bookings
          </h3>
          <p className="text-gray-600">
            Please refresh or try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-white to-gray-50/30">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="my-10">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
            Manage Bookings
          </h1>
          <p className="text-gray-600 text-sm">
            Monitor and manage all turf bookings, payments, and status
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{bookings.length}</p>
                <p className="text-sm text-gray-600">Total Bookings</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{bookings.filter(b => b.bookingStatus === 'confirmed').length}</p>
                <p className="text-sm text-gray-600">Confirmed</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{bookings.filter(b => b.bookingStatus === 'pending').length}</p>
                <p className="text-sm text-gray-600">Pending</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{formatCurrency(bookings.reduce((sum, b) => sum + b.paymentAmount, 0))}</p>
                <p className="text-sm text-gray-600">Total Revenue</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search + Filter */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Search by booking ID, email, or turf name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 outline-none text-sm"
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 text-sm bg-white"
            >
              <option value="all">All Booking Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select
              value={filterPayment}
              onChange={(e) => setFilterPayment(e.target.value)}
              className="px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 text-sm bg-white"
            >
              <option value="all">All Payment Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {filteredBookings?.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="w-12 h-12 text-gray-400 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                No Bookings Found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search or filters.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                      Booking Details
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                      User & Turf
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                      Schedule
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                      Payment
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredBookings?.map((booking) => (
                    <tr key={booking?._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900 text-sm">
                            {booking?.bookingId}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(booking?.createdAt)}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {booking?.userEmail}
                          </p>
                          <p className="text-xs text-gray-600">
                            {booking?.turfName}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm text-gray-900">
                            {formatDate(booking?.date)}
                          </p>
                          <p className="text-xs text-gray-600">
                            {booking?.timeSlot}
                          </p>
                          <p className="text-xs text-gray-500">
                            {booking?.duration}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {formatCurrency(booking?.paymentAmount)}
                          </p>
                          <span
                            className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                              booking?.paymentStatus === 'paid'
                                ? "bg-green-100 text-green-800"
                                : booking?.paymentStatus === 'pending'
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {booking?.paymentStatus}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            booking?.bookingStatus === 'confirmed'
                              ? "bg-green-100 text-green-800"
                              : booking?.bookingStatus === 'pending'
                              ? "bg-yellow-100 text-yellow-800"
                              : booking?.bookingStatus === 'completed'
                              ? "bg-blue-100 text-blue-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {booking?.bookingStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {booking?.bookingStatus === 'pending' && (
                            <button
                              onClick={() => handleBookingStatusUpdate(booking?._id, 'confirmed')}
                              className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded hover:bg-green-200"
                            >
                              Confirm
                            </button>
                          )}
                          {booking?.paymentStatus === 'pending' && (
                            <button
                              onClick={() => handlePaymentStatusUpdate(booking?._id, 'paid')}
                              className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded hover:bg-blue-200"
                            >
                              Mark Paid
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteBooking(booking?._id)}
                            className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded hover:bg-red-200"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageBookings;