// App.jsx
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from "react-router-dom";
import { FaShoppingCart, FaBars } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile } from "./slices/userSlice";
import { fetchCart } from "./slices/cartSlice";
import Home from "./pages/Home";
import About from "./pages/About";
import ContactUs from "./pages/ContactUs";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ProductsLayout from "./pages/products/ProductsLayout";
import Cart from "./pages/products/Cart";
import OrderSuccess from "./pages/products/OrderSuccess";
import OrderHistory from "./pages/products/OrderHistory";
import Sidebar from "./pages/products/Sidebar";

function PrivateRoute({ children }) {
  const user = useSelector((state) => state.user.user);
  return user ? children : <Navigate to="/signin" replace />;
}

function AnimatedRoutes() {
  const user = useSelector((state) => state.user.user);
  return (
    <Routes>
      <Route path="/" element={
        <>
          {/* Hero Section only on Home */}
          <div className="flex flex-col items-center justify-center text-center py-20 px-4">
            <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-pink-500 to-yellow-500 mb-6 drop-shadow-lg">
              Welcome to ShopEase
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-2xl">
              Discover a seamless shopping experience with vibrant deals, easy navigation, and a community you can trust. Join us and make your shopping journey colorful and fun!
            </p>
            <Link to="/signup" className="px-8 py-3 rounded-full bg-gradient-to-r from-blue-500 via-pink-400 to-yellow-400 text-white font-bold text-lg shadow-lg hover:scale-105 transition-transform duration-200">
              Get Started
            </Link>
          </div>
          <Home />
        </>
      } />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<ContactUs />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      {user && <Route path="/products/*" element={<ProductsLayout />} />}
      {user && <Route path="/cart" element={<Cart />} />}
      {user && <Route path="/order-success" element={<OrderSuccess />} />}
      {user && <Route path="/order-history" element={<OrderHistory />} />}
      {/* Redirect all other routes to /signin if not logged in, or to /products if logged in */}
      <Route path="*" element={user ? <Navigate to="/products" replace /> : <Navigate to="/signin" replace />} />
    </Routes>
  );
}

function CartBadge() {
  const cart = useSelector((state) => state.cart.items);
  const user = useSelector((state) => state.user.user);
  if (!user) return null;
  return (
    <Link to="/cart" className="relative px-4 py-2 rounded-full text-white font-semibold bg-gray-700 shadow-md hover:bg-white hover:text-gray-700 transition-colors duration-200 flex items-center gap-2">
      <FaShoppingCart className="text-xl" />
      Cart
      {cart.length > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5 font-bold">{cart.length}</span>
      )}
    </Link>
  );
}

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const userStatus = useSelector((state) => state.user.status);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // // Only fetch profile once on mount if user is not present
  // useEffect(() => {
  //   if (!user) {
  //     dispatch(fetchProfile());
  //   }
  //   // eslint-disable-next-line
  // }, []);

  useEffect(() => {
    if (user && user._id) {
      dispatch(fetchCart());
    }
  }, [dispatch, user?._id]);

  // Hide sidebar drawer if user logs out
  useEffect(() => {
    if (!user) setSidebarOpen(false);
  }, [user]);

  if (userStatus === "loading") return <div>Loading...</div>;

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-pink-100 to-yellow-100">
        <nav className="navbar bg-gradient-to-r from-blue-500 via-pink-400 to-yellow-400 shadow-lg px-8 py-4 rounded-b-3xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            {user && (
              <button
                className="p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open sidebar"
              >
                <FaBars className="text-3xl text-white" />
              </button>
            )}
            <span className="text-3xl font-extrabold text-white drop-shadow-lg tracking-wide">🛍️ ShopEase</span>
          </div>
          <ul className="hidden md:flex gap-4 items-center">
            <li>
              <Link to="/" className="px-4 py-2 rounded-full text-white font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-200 bg-blue-600 shadow-md">Home</Link>
            </li>
            <li>
              <Link to="/about" className="px-4 py-2 rounded-full text-white font-semibold hover:bg-white hover:text-pink-600 transition-colors duration-200 bg-pink-500 shadow-md">About</Link>
            </li>
            <li>
              <Link to="/contact" className="px-4 py-2 rounded-full text-white font-semibold hover:bg-white hover:text-yellow-600 transition-colors duration-200 bg-yellow-400 shadow-md">Contact Us</Link>
            </li>
            {user && <li><CartBadge /></li>}
            {!user && (
              <>
                <li>
                  <Link to="/signin" className="px-4 py-2 rounded-full text-white font-semibold hover:bg-white hover:text-green-600 transition-colors duration-200 bg-green-500 shadow-md">Sign In</Link>
                </li>
                <li>
                  <Link to="/signup" className="px-4 py-2 rounded-full text-white font-semibold hover:bg-white hover:text-purple-600 transition-colors duration-200 bg-purple-500 shadow-md">Sign Up</Link>
                </li>
              </>
            )}
          </ul>
        </nav>
        {/* Sidebar Drawer Overlay */}
        {user && (
          <>
            {/* Desktop sidebar (always visible on md+) */}
            <div className="hidden md:block fixed left-0 top-0 h-full w-64 z-30 pt-[96px]">
              <Sidebar />
            </div>
            {/* Mobile sidebar drawer */}
            {sidebarOpen && (
              <div className="fixed inset-0 z-40 flex md:hidden">
                {/* Overlay */}
                <div
                  className="fixed inset-0 bg-black bg-opacity-40 transition-opacity"
                  onClick={() => setSidebarOpen(false)}
                ></div>
                {/* Sidebar Drawer */}
                <div className="relative z-50 w-64 h-full bg-white shadow-xl animate-slide-in-left">
                  <button
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl"
                    onClick={() => setSidebarOpen(false)}
                    aria-label="Close sidebar"
                  >
                    ×
                  </button>
                  <Sidebar />
                </div>
              </div>
            )}
          </>
        )}
        <div className={`p-4 ${user ? 'md:ml-64' : ''}`}>
          <AnimatedRoutes />
        </div>
      </div>
    </Router>
  );
}

export default App;

/* Add this to your global CSS (e.g., index.css) for the slide-in animation: */
/*
@keyframes slide-in-left {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}
.animate-slide-in-left {
  animation: slide-in-left 0.3s cubic-bezier(0.4,0,0.2,1) both;
}
*/
