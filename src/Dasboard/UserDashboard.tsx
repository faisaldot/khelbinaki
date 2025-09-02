// DashboardLayout.tsx
import { Link, Outlet } from "react-router";
import Logo from "../../public/KhelbaNakiLogo.png";
const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg flex flex-col">
        {/* Logo */}
        <div className="flex items-center justify-center py-6 border-b">
          <img src={Logo} alt="Logo" className="w-28" />
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-5 space-y-3">
          <Link
            to="/dashboard/profile"
            className="block px-4 py-2 rounded-lg hover:bg-green-100 font-medium transition"
          >
            Profile Management
          </Link>
          <Link
            to="/dashboard/bookings"
            className="block px-4 py-2 rounded-lg hover:bg-green-100 font-medium transition"
          >
            My Bookings
          </Link>
          <Link
            to="/dashboard/favourites"
            className="block px-4 py-2 rounded-lg hover:bg-green-100 font-medium transition"
          >
            Favourite Turf
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
