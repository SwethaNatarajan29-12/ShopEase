import React from "react";
import { useSelector } from "react-redux";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088FE", "#FFBB28"];

export default function DashboardCharts() {
  const orders = useSelector((state) => state.order.orders) || [];
  const cartItems = useSelector((state) => state.cart.items) || [];

  // Orders by status (for PieChart)
  const statusCounts = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {});
  const statusData = Object.entries(statusCounts).map(([status, count]) => ({ name: status, value: count }));

  // Orders over time (for BarChart)
  const ordersByDate = orders.reduce((acc, order) => {
    const date = new Date(order.createdAt).toLocaleDateString();
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});
  const dateData = Object.entries(ordersByDate).map(([date, count]) => ({ date, Orders: count }));

  // Cart items by category (for PieChart)
  const cartByCategory = cartItems.reduce((acc, item) => {
    const cat = item.category || item.product?.category || "Other";
    acc[cat] = (acc[cat] || 0) + (item.quantity || 1);
    return acc;
  }, {});
  const cartCatData = Object.entries(cartByCategory).map(([name, value]) => ({ name, value }));

  return (
    <div className="w-full flex flex-row gap-8 justify-center items-stretch mt-8 overflow-x-auto">
      <div className="bg-white rounded-3xl shadow-2xl p-8 min-w-[340px] max-w-[400px] flex flex-col items-center transition-transform hover:scale-105">
        <h3 className="text-xl font-bold mb-4 text-blue-600 tracking-tight">Orders by Status</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
              {statusData.map((entry, idx) => (
                <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-white rounded-3xl shadow-2xl p-8 min-w-[340px] max-w-[400px] flex flex-col items-center transition-transform hover:scale-105">
        <h3 className="text-xl font-bold mb-4 text-pink-600 tracking-tight">Orders Over Time</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={dateData}>
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="Orders" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-white rounded-3xl shadow-2xl p-8 min-w-[340px] max-w-[400px] flex flex-col items-center transition-transform hover:scale-105">
        <h3 className="text-xl font-bold mb-4 text-yellow-600 tracking-tight">Cart Items by Category</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={cartCatData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
              {cartCatData.map((entry, idx) => (
                <Cell key={`cell-cat-${idx}`} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
