import { Link, NavLink, Outlet } from "react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Logo from "../../public/KhelbaNakiLogo.png";
import { navConfig } from "../Config/navConfig";

const DashboardLayout = ({ role = "user" }: { role?: "user" | "admin" | "manager" }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "sm:px-4 px-2 py-2 rounded-t-lg text-green-700 font-medium border-b-2 border-green-600 bg-white shadow-sm"
      : "px-4 py-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-t-lg transition";

  const links = navConfig[role];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Top Navbar */}
      <header className="w-full border-b-2 border-green-600">
        <div className="flex items-center justify-between px-4 md:px-8 py-2">
          {/* Logo */}
          <Link to={"/"} className="flex items-center gap-2">
            <img src={Logo} alt="Logo" className="w-20" />
          </Link>
          {/* Desktop Tabs */}
          <nav className="hidden md:flex gap-4">
            {links.map((link) => (
              <NavLink key={link.path} to={link.path} className={navLinkClass}>
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-green-700 hover:bg-green-200 rounded"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Tab Menu */}
        {isOpen && (
          <nav className="md:hidden flex gap-3 px-4 pb-3 overflow-x-auto scrollbar-hide">
            {links.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={navLinkClass}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
