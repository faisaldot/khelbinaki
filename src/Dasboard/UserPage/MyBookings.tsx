const MyBookings = () => {
  // Dummy bookings data
  const bookings = [
    {
      id: 1,
      email: "user1@example.com",
      turfName: "Green Field Turf",
      location: "Dhanmondi, Dhaka",
      bookingSlot: "5AM - 7AM",
      amount: "1200 BDT",
      paymentSystem: "Bkash",
      tranID: "TXN123456",
      bookingTime: "2025-09-03 10:30 AM",
      turfImg:
        "https://png.pngtree.com/thumb_back/fh260/background/20250319/pngtree-football-soccer-stadium-top-view-crowdy-atmosphere-image_17105890.jpg",
    },
    {
      id: 2,
      email: "user2@example.com",
      turfName: "City Sports Turf",
      location: "Banani, Dhaka",
      bookingSlot: "7AM - 9AM",
      amount: "1500 BDT",
      paymentSystem: "Nagad",
      tranID: "TXN654321",
      bookingTime: "2025-09-02 05:45 PM",
      turfImg:
        "https://www.lawnpop.com/wp-content/uploads/2024/01/playground-turf-a-smart-and-safe-choice-for-your-outdoor-space.jpg",
    },
  ];

  return (
    <div className="p-6">
     
     <h1 className="text-4xl font-bold text-gray-600 mb-7">My Booking</h1>
      <div className="overflow-x-auto shadow rounded">
        <table className="table-auto border-collapse border border-gray-300 w-full text-left sm:text-base text-[10px]">
          <thead>
            <tr className="bg-gradient-to-r from-green-600 to-green-700 text-white">
              <th className="px-4 py-2 border">Image</th>
              <th className="px-4 py-2 border">Turf Name</th>
              <th className="px-4 py-2 border">Location</th>
              <th className="px-4 py-2 border">Slot</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Payment</th>
              <th className="px-4 py-2 border">Amount</th>
              <th className="px-4 py-2 border">Tran ID</th>
              <th className="px-4 py-2 border">Booking Time</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr
                key={booking.id}
                className="hover:bg-green-50 transition duration-200"
              >
                <td className="px-4 py-2 border">
                  <img
                    src={booking.turfImg}
                    alt={booking.turfName}
                    className="w-20 h-12 object-cover rounded"
                  />
                </td>
                <td className="px-4 py-2 border font-semibold">
                  {booking.turfName}
                </td>
                <td className="px-4 py-2 border">{booking.location}</td>
                <td className="px-4 py-2 border">{booking.bookingSlot}</td>
                <td className="px-4 py-2 border">{booking.email}</td>
                <td className="px-4 py-2 border">{booking.paymentSystem}</td>
                <td className="px-4 py-2 border">{booking.amount}</td>
                <td className="px-4 py-2 border text-green-600 font-bold">
                  {booking.tranID}
                </td>
                <td className="px-4 py-2 border">{booking.bookingTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyBookings;
