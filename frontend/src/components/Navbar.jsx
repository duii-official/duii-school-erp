import { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    setIsLoggedIn(!!token);
    setUserRole(role);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    setUserRole(null);
    navigate("/");
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <div className="flex justify-center mt-4 px-4">
      <nav className="w-[95%] max-w-7xl bg-gradient-to-r from-green-600 to-blue-800 text-white px-8 py-3 flex items-center justify-between shadow-xl rounded-xl border border-white/30 shadow-gray-900/50">
        <h1 className="text-lg md:text-2xl font-bold">DUII Management</h1>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6 ml-auto">
          {navLinks.map(({ name, path }) => (
            <NavLink key={path} to={path} className="relative px-4 py-2 font-medium transition duration-300">
              {({ isActive }) => (
                <>
                  <span className={`relative z-10 ${isActive ? "text-white font-semibold" : "hover:text-gray-200"}`}>
                    {name}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="underline"
                      className="absolute bottom-0 left-0 w-full h-[3px] bg-white rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}

          {isLoggedIn && userRole === "admin" && (
            <NavLink 
              to="/adminpanel"
              className="bg-yellow-500 text-white px-4 py-2 rounded-lg font-semibold shadow-md hover:bg-yellow-600 transition duration-300"
            >
              Admin Panel
            </NavLink>
          )}

          {isLoggedIn ? (
            <button 
              onClick={handleLogout} 
              className="bg-white text-red-600 px-4 py-2 rounded-xl font-semibold shadow-md hover:bg-red-300 transition duration-300"
            >
              Logout
            </button>
          ) : (
            <NavLink 
              to="/login" 
              className="bg-white text-green-600 px-4 py-2 rounded-lg font-semibold shadow-md hover:bg-green-300 transition duration-300"
            >
              Login
            </NavLink>
          )}
        </div>

        {/* Mobile Menu Button */}
        {!menuOpen && (
          <button className="md:hidden relative z-50" onClick={() => setMenuOpen(true)}>
            <Menu size={24} />
          </button>
        )}

        {/* Mobile Menu */}
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: menuOpen ? 0 : "100%" }}
          transition={{ type: "spring", stiffness: 80, damping: 15 }}
          className="fixed top-0 right-0 w-4/5 h-full bg-blue-900 text-white flex flex-col items-center py-6 space-y-6 shadow-lg md:hidden rounded-tl-xl rounded-bl-xl z-[60] no-global-transition"
        >
          <button 
            className="absolute top-4 right-4 p-2 w-10 h-10 bg-white/20 hover:bg-white/30 text-white rounded-full flex items-center justify-center"
            onClick={() => setMenuOpen(false)}
          >
            <X size={24} />
          </button>

          {navLinks.map(({ name, path }) => (
            <NavLink key={path} to={path} onClick={() => setMenuOpen(false)} className="relative px-6 py-3 font-medium transition duration-300">
              {({ isActive }) => (
                <>
                  <span className={`relative z-10 ${isActive ? "text-white font-semibold" : "hover:text-gray-200"}`}>
                    {name}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="underline"
                      className="absolute bottom-0 left-0 w-full h-[3px] bg-white rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}

          {isLoggedIn && userRole === "admin" && (
            <NavLink 
              to="/adminpanel"
              onClick={() => setMenuOpen(false)}
              className="bg-yellow-500 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-yellow-600 transition duration-300"
            >
              Admin Panel
            </NavLink>
          )}

          {isLoggedIn ? (
            <button 
              onClick={() => { handleLogout(); setMenuOpen(false); }} 
              className="bg-white text-red-600 px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-red-300 transition duration-300"
            >
              Logout
            </button>
          ) : (
            <NavLink 
              to="/login" 
              onClick={() => setMenuOpen(false)}
              className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-green-300 transition duration-300"
            >
              Login
            </NavLink>
          )}
        </motion.div>
      </nav>
    </div>
  );
};

export default Navbar;
