import { useState } from "react";

const AdminBookingManagement = () => {
  // Fake booking data
  const [bookings, setBookings] = useState([
    {
      id: 1,
      time: "5:00 AM - 7:00 AM",
      date: "2025-09-10",
      paymentStatus: "Paid",
      paymentGateway: "Stripe",
      turfName: "Green Field Turf",
      location: "Dhanmondi, Dhaka",
      amount: 1200,
      email: "user1@example.com",
    },
    {
      id: 2,
      time: "7:30 AM - 9:30 AM",
      date: "2025-09-11",
      paymentStatus: "Pending",
      paymentGateway: "Bkash",
      turfName: "City Sports Turf",
      location: "Uttara, Dhaka",
      amount: 1000,
      email: "user2@example.com",
    },
    {
      id: 3,
      time: "6:00 PM - 8:00 PM",
      date: "2025-09-12",
      paymentStatus: "Failed",
      paymentGateway: "Nagad",
      turfName: "Arena Turf",
      location: "Banani, Dhaka",
      amount: 1500,
      email: "user3@example.com",
    },
  ]);

  // Delete Handler
  const handleDelete = (id: number) => {
    setBookings(bookings.filter((booking) => booking.id !== id));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Booking Management</h2>

      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="w-full text-sm md:text-base">
          <thead className="bg-green-100">
            <tr>
              <th className="p-3 text-left border-b">Time</th>
              <th className="p-3 text-left border-b">Date</th>
              <th className="p-3 text-left border-b">Payment</th>
              <th className="p-3 text-left border-b">Gateway</th>
              <th className="p-3 text-left border-b">Turf</th>
              <th className="p-3 text-left border-b">Location</th>
              <th className="p-3 text-left border-b">Amount</th>
              <th className="p-3 text-left border-b">User Email</th>
              <th className="p-3 text-center border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id} className="hover:bg-gray-50">
                <td className="p-3 border-b">{b.time}</td>
                <td className="p-3 border-b">{b.date}</td>
                <td
                  className={`p-3 border-b font-medium ${
                    b.paymentStatus === "Paid"
                      ? "text-green-600"
                      : b.paymentStatus === "Pending"
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {b.paymentStatus}
                </td>
                <td className="p-3 border-b">{b.paymentGateway}</td>
                <td className="p-3 border-b">{b.turfName}</td>
                <td className="p-3 border-b">{b.location}</td>
                <td className="p-3 border-b font-semibold">৳{b.amount}</td>
                <td className="p-3 border-b">{b.email}</td>
                <td className="p-3 border-b text-center">
                  <button
                    onClick={() => handleDelete(b.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {bookings.length === 0 && (
              <tr>
                <td
                  colSpan={9}
                  className="text-center p-4 text-gray-500 italic"
                >
                  No bookings found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminBookingManagement;
