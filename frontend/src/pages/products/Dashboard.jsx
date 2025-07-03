import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "../../slices/orderSlice";
import { fetchCart } from "../../slices/cartSlice";
import DashboardCharts from "./DashboardCharts";

const Dashboard = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const orders = useSelector((state) => state.order.orders);
  const cartItems = useSelector((state) => state.cart.items);

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchOrders(user._id));
      dispatch(fetchCart());
    }
  }, [dispatch, user?._id]);

  return (
    <div className="w-full min-w-[110vh] flex justify-center items-start bg-gradient-to-br from-blue-50 via-pink-50 to-yellow-50 py-6 px-1 md:px-5">
      <div className="w-full max-w-[1100px] bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-4 md:p-8 flex flex-col gap-8 md:gap-12 items-center">
        {/* Summary Cards Row */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-8 w-full justify-center mb-6 md:mb-8">
          <div className="bg-blue-100 rounded-2xl p-4 md:p-6 flex flex-col items-center shadow-md min-w-[160px] md:min-w-[220px]">
            <span className="text-2xl md:text-3xl font-bold text-blue-600 mb-1 md:mb-2">{orders?.length ?? 0}</span>
            <span className="text-gray-700">Orders</span>
          </div>
          <div className="bg-pink-100 rounded-2xl p-4 md:p-6 flex flex-col items-center shadow-md min-w-[160px] md:min-w-[220px]">
            <span className="text-2xl md:text-3xl font-bold text-pink-600 mb-1 md:mb-2">0</span>
            <span className="text-gray-700">Wishlist</span>
          </div>
          <div className="bg-yellow-100 rounded-2xl p-4 md:p-6 flex flex-col items-center shadow-md min-w-[160px] md:min-w-[220px]">
            <span className="text-2xl md:text-3xl font-bold text-yellow-600 mb-1 md:mb-2">{cartItems?.length ?? 0}</span>
            <span className="text-gray-700">Cart Items</span>
          </div>
        </div>
        {/* Charts Row */}
        <div className="w-full">
          <DashboardCharts />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
