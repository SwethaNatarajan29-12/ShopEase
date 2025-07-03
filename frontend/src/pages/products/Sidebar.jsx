import React from "react";
import { FaUserCircle, FaTachometerAlt, FaBoxOpen, FaMapMarkerAlt, FaSignOutAlt } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../slices/userSlice";
import { resetCart } from "../../slices/cartSlice";

const Sidebar = () => {
  const user = useSelector((state) => state.user.user);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogout = async () => {
    try {
      // Call backend logout API to clear cookies on server
      await fetch('/api/users/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (e) {
      // Ignore errors, proceed with client-side cleanup
    }
    // Clear Redux user state
    dispatch(logout());
    // Clear Redux cart state
    dispatch(resetCart());
    // Clear all cookies
    document.cookie.split(';').forEach(c => {
      document.cookie = c
        .replace(/^ +/, '')
        .replace(/=.*/, '=;expires=' + new Date(0).toUTCString() + ';path=/');
    });
    // Clear localStorage and sessionStorage
    localStorage.clear();
    sessionStorage.clear();
    // Redirect to signin and force reload to clear all Redux state
    navigate("/signin");
    window.location.reload();
  };
  if (!user) return null;
  // Helper to truncate username to fit sidebar width (w-64 ~ 16rem)
  const truncate = (str, n = 18) => (str && str.length > n ? str.slice(0, n) + '...' : str);
  return (
    <aside className="bg-white/90 backdrop-blur-md shadow-xl rounded-2xl p-3 w-64 h-[820px] flex flex-col gap-8 self-start my-4 justify-between left-10 fixed z-30">
      <div>
        <div className="flex flex-col items-center mb-8">
          <FaUserCircle className="text-6xl text-blue-400 mb-2" />
          <span
            className="font-bold text-lg text-gray-700 max-w-full truncate block text-center"
            style={{ maxWidth: '14rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
            title={user.username || "User"}
          >
            {truncate(user.username || "User")}
          </span>
          <span className="text-sm text-gray-400">{user.email || ""}</span>
        </div>
        <nav className="flex flex-col gap-4">
          <Link to="/products/dashboard" className={`flex items-center gap-3 px-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${location.pathname === "/products/dashboard" ? "bg-blue-100 text-blue-600" : "hover:bg-blue-50 text-gray-700"}`}><FaTachometerAlt /> Dashboard</Link>
          <Link to="/products/products" className={`flex items-center gap-3 px-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${location.pathname === "/products/products" ? "bg-pink-100 text-pink-600" : "hover:bg-pink-50 text-gray-700"}`}><FaBoxOpen /> Products</Link>
          <Link to="/products/profile" className={`flex items-center gap-3 px-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${location.pathname === "/products/profile" ? "bg-yellow-100 text-yellow-600" : "hover:bg-yellow-50 text-gray-700"}`}><FaUserCircle /> Profile</Link>
          <Link to="/products/manage-addresses" className={`flex items-center gap-3 px-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${location.pathname === "/products/manage-addresses" ? "bg-pink-100 text-pink-600" : "hover:bg-pink-50 text-gray-700"}`}><FaMapMarkerAlt /> Manage Addresses</Link>
        </nav>
      </div>
      <button
        className="flex items-center gap-3 px-4 py-2 rounded-lg font-semibold text-red-500 hover:bg-red-50 transition-colors duration-200 mt-8 w-full justify-center"
        onClick={handleLogout}
      >
        <FaSignOutAlt className="text-xl" /> Logout
      </button>
    </aside>
  );
};

export default Sidebar;
