import { useState, useRef, useEffect } from "react";
import { IoMdArrowForward } from "react-icons/io";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const BookingShort = () => {
  const [turf, setTurf] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const bookedDates = [
    new Date(2025, 7, 28),
    new Date(2025, 7, 30),
  ];

  const isDateDisabled = (day: Date) =>
    bookedDates.some(d => d.toDateString() === day.toDateString());

  const handleBooking = () => {
    if (!turf || !date) {
      alert("Please select turf and date!");
      return;
    }
    console.log("Selected Turf:", turf);
    console.log("Selected Date:", date.toDateString());
  };

  // Click outside dropdown to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const turfs = ["Turf 1", "Turf 2", "Turf 3"];

  return (
    <div className="flex justify-center mt-20 relative">
      <div className="h-auto py-6 bg-white border border-green-200 shadow-2xl rounded-[100px] flex flex-col md:flex-row items-center justify-center gap-8 absolute -top-40 z-10 px-7 ps-10">
        
        {/* Turf Select */}
        <div className="relative w-52 border-r-2" ref={dropdownRef}>
          <h2 className="text-gray-700 font-semibold">Turf Location?</h2>
          <div>
            <button
              className="m-1 cursor-pointer font-semibold text-gray-400 w-full text-left"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              {turf ? turf : "⚽ Select Turf"}
            </button>

            {isDropdownOpen && (
              <ul className="menu bg-base-100 rounded-box z-10 w-full p-2 shadow-sm absolute mt-1">
                {turfs.map((item) => (
                  <li key={item}>
                    <a
                      onClick={() => {
                        setTurf(item);
                        console.log("Selected Turf:", item);
                        setIsDropdownOpen(false);
                      }}
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Date Picker */}
        <div className="relative w-56">
          <h2 className="text-gray-700 font-semibold">Which Date You Play ?</h2>
          <DatePicker
            selected={date}
            onChange={(d) => setDate(d)}
            minDate={new Date()}
            filterDate={(d) => !isDateDisabled(d)}
            dateFormat="dd MMM yyyy"
            placeholderText="📅 Select Date"
            className="w-full py-2 rounded-2xl text-gray-600 font-medium cursor-pointer outline-none"
          />
        </div>

        {/* Booking Button */}
        <button
          onClick={handleBooking}
          className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-4 rounded-4xl hover:from-green-700 hover:to-green-800 transition flex justify-center items-center gap-x-2 shadow-lg font-semibold text-lg"
        >
          Booking <IoMdArrowForward size={22} />
        </button>
      </div>
    </div>
  );
};

export default BookingShort;
