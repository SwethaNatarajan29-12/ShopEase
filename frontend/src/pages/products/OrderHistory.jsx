import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "../../slices/orderSlice";

const OrderHistory = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const { orders, status, error } = useSelector((state) => state.order);

  useEffect(() => {
    if (user?._id) dispatch(fetchOrders(user._id));
  }, [dispatch, user]);

  if (!user) return <div className="text-center mt-16 text-xl text-gray-500">Please sign in to view your orders.</div>;
  if (status === 'loading') return <div className="text-center mt-16 text-xl text-gray-400">Loading orders...</div>;
  if (error) return <div className="text-center mt-16 text-xl text-red-500">{error}</div>;
  if (!orders.length) return <div className="text-center mt-16 text-xl text-gray-400">No orders found.</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-3xl font-extrabold text-blue-700 mb-8 text-center">Order History</h2>
      <div className="divide-y divide-gray-200">
        {orders.map((order) => (
          <div key={order._id} className="py-6">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-lg text-gray-800">Order #{order._id.slice(-6).toUpperCase()}</span>
              <span className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</span>
              <span className="text-sm px-3 py-1 rounded-full bg-green-100 text-green-700 font-semibold">{order.status}</span>
            </div>
            <div className="flex flex-wrap gap-4 mb-2">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-gray-50 rounded-lg p-2 shadow-sm">
                  <img src={item.image} alt={item.name} className="w-12 h-12 object-contain rounded" />
                  <div>
                    <div className="font-semibold text-gray-700">{item.name}</div>
                    <div className="text-xs text-gray-500">x{item.quantity} &bull; ${item.price}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-gray-700">Payment: <span className="font-semibold">{order.paymentMethod.toUpperCase()}</span></span>
              <span className="text-blue-700 font-bold text-lg">Total: ${order.total.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;
