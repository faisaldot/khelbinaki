import { useState } from "react";

const PaymentFailed = () => {
  const [errorCode] = useState("ERR-502-XYZ");

  const copyErrorCode = () => {
    navigator.clipboard.writeText(errorCode).then(() => {
      alert("Error Code copied: " + errorCode);
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-red-50 to-red-100">
      {/* Main */}
      <main className="flex flex-col items-center justify-center flex-grow text-center p-4 md:p-6">
        {/* Error Icon */}
        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-red-100 shadow-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-red-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="9" y1="9" x2="15" y2="15"></line>
            <line x1="15" y1="9" x2="9" y2="15"></line>
          </svg>
        </div>

        <h1 className="mt-6 text-2xl sm:text-4xl font-bold text-gray-800">
          Payment Failed
        </h1>
        <p className="mt-2 text-gray-600 text-sm sm:text-base">
          Oops! Something went wrong while processing your booking.
        </p>

        {/* Error Details card */}
        <div className="mt-8 w-full max-w-lg bg-white/70 backdrop-blur-lg border rounded-2xl p-6 shadow-lg space-y-4 text-left">
          <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
            Failure Details
          </h2>

          <div className="grid grid-cols-2 gap-4 text-sm sm:text-base">
            <div>
              <p className="text-gray-500">Attempted Amount</p>
              <p className="font-medium">৳1200</p>
            </div>
            <div>
              <p className="text-gray-500">Date</p>
              <p className="font-medium">September 12, 2025</p>
            </div>
            <div>
              <p className="text-gray-500">Time Slot</p>
              <p className="font-medium">5am - 7am</p>
            </div>
            <div>
              <p className="text-gray-500">Booking ID</p>
              <p className="font-medium">BK-20250911-002</p>
            </div>
          </div>

          {/* Error Code with Copy */}
          <div className="flex justify-between items-center text-sm sm:text-base pt-3 border-t">
            <span className="text-gray-500">Error Code:</span>
            <div className="flex items-center gap-2">
              <span className="font-medium select-text">{errorCode}</span>
              <button
                onClick={copyErrorCode}
                className="px-3 py-1 text-xs font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                Copy
              </button>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-8 flex gap-4">
          <a
            href="/"
            className="inline-flex items-center justify-center h-11 px-6 text-sm font-medium text-white bg-red-600 rounded-xl shadow-md hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Return to Homepage
          </a>
          <a
            href="/support"
            className="inline-flex items-center justify-center h-11 px-6 text-sm font-medium text-red-600 border border-red-600 rounded-xl hover:bg-red-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Contact Support
          </a>
        </div>
      </main>
    </div>
  );
};

export default PaymentFailed;
