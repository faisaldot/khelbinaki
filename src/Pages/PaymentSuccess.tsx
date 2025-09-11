import { useState } from "react";

const PaymentSuccess = () => {
  const [tranId] = useState("TXN-987654321");

  const copyTranId = () => {
    navigator.clipboard.writeText(tranId).then(() => {
      alert("Transaction ID copied: " + tranId);
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      {/* Main */}
      <main className="flex flex-col items-center justify-center flex-grow text-center p-4 md:p-6">
        {/* Success Icon */}
        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-green-100 shadow-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-green-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <path d="m9 12 2 2 4-4"></path>
          </svg>
        </div>

        <h1 className="mt-6 text-2xl sm:text-4xl font-bold text-gray-800">
          Booking Successful
        </h1>
        <p className="mt-2 text-gray-600 text-sm sm:text-base">
          Thank you for your booking! Your turf has been reserved.
        </p>

        {/* Details card */}
        <div className="mt-8 w-full max-w-lg bg-white/70 backdrop-blur-lg border rounded-2xl p-6 shadow-lg space-y-4 text-left">
          <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
            Booking Details
          </h2>

          <div className="grid grid-cols-2 gap-4 text-sm sm:text-base">
            <div>
              <p className="text-gray-500">Amount Paid</p>
              <p className="font-medium">৳1200</p>
            </div>
            <div>
              <p className="text-gray-500">Booking Date</p>
              <p className="font-medium">September 12, 2025</p>
            </div>
            <div>
              <p className="text-gray-500">Time Slot</p>
              <p className="font-medium">5am - 7am</p>
            </div>
            <div>
              <p className="text-gray-500">Booking ID</p>
              <p className="font-medium">BK-20250911-001</p>
            </div>
            <div>
              <p className="text-gray-500">Turf Location</p>
              <p className="font-medium">GreenField Arena, Dhaka</p>
            </div>
            <div>
              <p className="text-gray-500">Turf Type</p>
              <p className="font-medium">5-a-side</p>
            </div>
            <div>
              <p className="text-gray-500">Surface</p>
              <p className="font-medium">Artificial Grass</p>
            </div>
            <div>
              <p className="text-gray-500">Duration</p>
              <p className="font-medium">2 Hours</p>
            </div>
          </div>

          {/* Transaction ID with Copy */}
          <div className="flex justify-between items-center text-sm sm:text-base pt-3 border-t">
            <span className="text-gray-500">Transaction ID:</span>
            <div className="flex items-center gap-2">
              <span className="font-medium select-text">{tranId}</span>
              <button
                onClick={copyTranId}
                className="px-3 py-1 text-xs font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
              >
                Copy
              </button>
            </div>
          </div>
        </div>

        {/* Button */}
        <a
          href="/"
          className="mt-8 inline-flex items-center justify-center h-11 px-6 text-sm font-medium text-white bg-green-600 rounded-xl shadow-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Return to Homepage
        </a>
      </main>
    </div>
  );
};

export default PaymentSuccess;
