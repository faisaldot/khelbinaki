// DashboardLayout.tsx
import { Link, NavLink, Outlet } from "react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Logo from "../../public/KhelbaNakiLogo.png";

const DashboardLayout = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "block px-4 py-2 text-green-600 border-b-2 border-green-600 hover:bg-green-100 transition"
      : "block px-4 py-2 border-b-2 border-green-600 hover:bg-green-100 transition";

  const sidebarVariants = {
    hidden: { x: "-100%", opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 70, damping: 15 },
    },
    exit: { x: "-100%", opacity: 0, transition: { duration: 0.3 } },
  };

  return (
    <div className="flex min-h-screen bg-gray-100 relative">
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute top-4 left-4 z-50 p-2 bg-green-600 text-white rounded md:hidden"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar - Desktop */}
      <div className="hidden md:flex w-64 bg-green-100 shadow-lg flex-col">
        {/* Logo */}
        <div className="flex items-center justify-center py-6 border-b">
          <Link to={"/"}>
            <img src={Logo} alt="Logo" className="w-28" />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-5 space-y-3">
          <NavLink to="/dashboard/profile" className={navLinkClass}>
            Profile Management
          </NavLink>
          <NavLink to="/dashboard/my-bookings" className={navLinkClass}>
            My Bookings
          </NavLink>
          <NavLink to="/dashboard/favourites" className={navLinkClass}>
            Favourite Turf
          </NavLink>
        </nav>
      </div>

      {/* Sidebar - Mobile (Animated) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mobile-sidebar"
            variants={sidebarVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed top-0 left-0 w-64 h-full bg-green-100 shadow-lg flex flex-col z-40 md:hidden"
          >
            {/* Logo */}
            <div className="flex items-center justify-between px-4 py-6 border-b">
              <Link to={"/"} onClick={() => setIsOpen(false)}>
                <img src={Logo} alt="Logo" className="w-28" />
              </Link>
              {/* <button onClick={() => setIsOpen(false)} className="text-green-600">
                <X size={28} />
              </button> */}
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-5 space-y-3">
              <NavLink
                to="/dashboard/profile"
                className={navLinkClass}
                onClick={() => setIsOpen(false)}
              >
                Profile Management
              </NavLink>
              <NavLink
                to="/dashboard/my-bookings"
                className={navLinkClass}
                onClick={() => setIsOpen(false)}
              >
                My Bookings
              </NavLink>
              <NavLink
                to="/dashboard/favourites"
                className={navLinkClass}
                onClick={() => setIsOpen(false)}
              >
                Favourite Turf
              </NavLink>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 p-6 md:ml-0 bg-gray-100">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
