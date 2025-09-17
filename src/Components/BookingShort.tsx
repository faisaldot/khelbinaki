import { useState, useRef, useEffect } from "react";
import { IoMdArrowForward } from "react-icons/io";
import { useNavigate } from "react-router";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useQuery } from "@tanstack/react-query";
import type { ApiResponse, Turf } from "../types/api.types";
import api from "../lib/api";

const BookingShort = () => {
  const [turf, setTurf] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const bookedDates = [new Date(2025, 7, 28), new Date(2025, 7, 30)];
  const isDateDisabled = (day: Date) =>
    bookedDates.some((d) => d.toDateString() === day.toDateString());

  const handleBooking = () => {
    if (!turf || !date) {
      alert("Please select turf and date!");
      return;
    }

    const formattedDate = date.toISOString().split("T")[0]; // 2025-09-20
    const slug = turf.toLowerCase().replace(/\s+/g, "-");

    navigate(`/turfs/${slug}?date=${formattedDate}`);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);








  // get names the turfs
    const {data } = useQuery({
    queryKey: ["turfs"],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Turf[]>>("/turfs",
      );
      return response.data;
    },
  });


  return (
    <div className="flex justify-center px-2 md:mt-20 relative md:w-auto w-full">
      <div className="h-auto p-4 bg-white border md:w-auto w-full border-green-200 shadow-2xl md:rounded-[100px] rounded-xl flex flex-col md:flex-row items-center justify-center gap-2 md:gap-8 md:absolute -top-40 z-10 md:ps-8">
        
        {/* Turf Select */}
        <div className="relative w-full md:w-52 md:border-r-2" ref={dropdownRef}>
          <h2 className="text-gray-700 font-semibold">Turf Location?</h2>
          <div>
            <button
              className="m-1 cursor-pointer font-semibold text-gray-400 w-full text-left"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              {turf ? turf : "⚽ Select Turf"}
            </button>

            {isDropdownOpen && (
              <ul className="menu bg-base-100 rounded-box z-10 w-full p-2 shadow-md absolute mt-1">
                {data?.data?.map((item) => (
                  <li key={item.slug}>
                    <a
                      onClick={() => {
                        setTurf(item.name);
                        setIsDropdownOpen(false);
                      }}
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Date Picker */}
        <div className="relative md:w-56 w-full">
          <h2 className="text-gray-700 font-semibold">Which Date You Play?</h2>
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
          className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 md:w-auto w-full md:py-4 py-2 rounded md:rounded-4xl hover:from-green-700 hover:to-green-800 transition flex justify-center items-center gap-x-2 shadow-lg font-semibold text-lg"
        >
          Booking <IoMdArrowForward size={22} />
        </button>
      </div>
    </div>
  );
};

export default BookingShort;
