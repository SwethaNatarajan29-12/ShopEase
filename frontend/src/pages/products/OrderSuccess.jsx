import React from "react";
import { Link } from "react-router-dom";

const OrderSuccess = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-pink-100 to-yellow-100 rounded-3xl shadow-2xl p-10 mt-10">
    <div className="bg-green-100 rounded-full p-8 mb-6 shadow">
      <svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
    </div>
    <h2 className="text-3xl font-extrabold text-green-600 mb-2">Order Placed Successfully!</h2>
    <div className="text-gray-600 text-lg mb-6 text-center">Thank you for your order. Your items will be shipped soon.</div>
    <Link to="/products/products" className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-500 via-pink-400 to-yellow-400 text-white font-bold shadow hover:scale-105 transition-transform duration-200 text-lg">
      Continue Shopping
    </Link>
  </div>
);

export default OrderSuccess;
