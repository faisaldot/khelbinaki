import { Link, NavLink } from "react-router";
import Logo from "../../public/KhelbaNakiLogo.png";
import Container from "./Container";
import { useAuth } from "../Hooks/useAuth";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const { user, logout } = useAuth();
  const role = user?.role;
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { to: "/turfs", label: "Turfs" },
    { to: "/gallery", label: "Gallery" },
    { to: "/about", label: "About Us" },
  ];

  return (
    <nav className="shadow-md  bg-white sticky  top-0 left-0 w-full z-50">
      <Container>
        <div className="flex justify-between items-center py-3">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img
              src={Logo}
              className="w-16 h-16 object-contain hover:scale-105 transition-transform"
              alt="Logo"
            />
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex gap-8 items-center text-gray-600 font-medium">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `hover:text-green-600 transition-colors ${
                    isActive ? "text-green-700 font-semibold" : ""
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

            {user && (
              <NavLink
to={role === "user" ? "/dashboard/profile" : "/dashboard"}                className={({ isActive }) =>
                  `hover:text-green-600 transition-colors ${
                    isActive ? "text-green-700 font-semibold" : ""
                  }`
                }
              >
                {role === "admin" ? "Admin Dashboard" : "Dashboard"}
              </NavLink>
            )}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex gap-4 items-center">
            {user ? (
            <Link to={"/auth/login"}>
                <button
                onClick={logout}
                className=" px-6 py-2.5 rounded-full text-white  bg-gradient-to-r from-green-600 to-green-700 font-semibold transition"
              >
                Logout
              </button>
            </Link>
            ) : (
              <>
                <Link to="/auth/login">
                  <button className="border px-6 py-2.5 rounded-full hover:bg-gray-100 transition border-green-700">
                    Login
                  </button>
                </Link>
                <Link to="/auth/register">
                  <button className="bg-gradient-to-r from-green-600 to-green-700 text-white px-7 py-2.5 rounded-full hover:scale-105 transition-transform shadow-md">
                    Register
                  </button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-white shadow-inner rounded-lg mt-2 overflow-hidden"
            >
              <div className="flex flex-col p-4 space-y-3 text-gray-600 font-medium">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `hover:text-green-600 transition-colors ${
                        isActive ? "text-green-700 font-semibold" : ""
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}

                {user && (
                  <NavLink 
                  to={role === "user" ? "/dashboard/profile" : "/dashboard"}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `hover:text-green-600 transition-colors ${
                        isActive ? "text-green-700 font-semibold" : ""
                      }`
                    }
                  >
                    {role === "admin" ? "Admin Dashboard" : "Dashboard"}
                  </NavLink>
                )}

                {/* Mobile Auth Buttons */}
                {user ? (
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="border px-6 py-2 rounded-full hover:bg-gray-100 transition border-green-700"
                  >
                    Logout
                  </button>
                ) : (
                  <>
                    <Link to="/auth/login" onClick={() => setIsOpen(false)}>
                      <button className="border w-full px-6 py-2 rounded-full hover:bg-gray-100 transition border-green-700">
                        Login
                      </button>
                    </Link>
                    <Link to="/auth/register" onClick={() => setIsOpen(false)}>
                      <button className="bg-gradient-to-r from-green-600 to-green-700 text-white w-full px-6 py-2 rounded-full hover:scale-105 transition-transform shadow-md">
                        Register
                      </button>
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </nav>
  );
};

export default Navbar;
