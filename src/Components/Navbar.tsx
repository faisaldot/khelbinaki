import { Link } from "react-router";
import Logo from "../../public/KhelbaNakiLogo.png";
import Container from "./Container";

const Navbar = () => {
  return (
    <nav className="shadow-md py-3 bg-white">
      <Container>
        <div className="flex justify-between items-center">
          {/* Left Side */}
          <div className="flex items-center gap-x-8 lg:gap-x-14">
           <Link to={"/"}>
            <img src={Logo} className="w-20 h-20 object-contain" alt="Logo" /></Link>
            <div className="flex gap-7  text-gray-500 font-normal">
              <Link to="/">Bookings</Link>
              <Link to="/my-booking">My Booking</Link>
              <Link to="/about">About Us</Link>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex gap-4">
            <button className="border px-8 py-2.5 rounded-full hover:bg-gray-100 transition border-green-700">
              Login
            </button>
         <Link to={"/register"}>
            <button className="bg-gradient-to-r from-green-600 to-green-700 text-white px-9 py-2.5 rounded-full hover:bg-green-700 transition">
              Register
            </button></Link>
          </div>
        </div>
      </Container>
    </nav>
  );
};

export default Navbar;
