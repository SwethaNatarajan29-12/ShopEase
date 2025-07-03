import React from "react";
import Sidebar from "./Sidebar";
import { Routes, Route, Navigate } from "react-router-dom";
import Products from "./Products";
import Dashboard from "./Dashboard";
import Profile from "./Profile";
import ManageAddresses from "./ManageAddresses";
import { useSelector } from "react-redux";

const ProductsLayout = ({ cart, setCart }) => {
  const user = useSelector((state) => state.user.user);
  if (!user) return <Navigate to="/signin" replace />;
  return (
    <div className="relative flex justify-center w-full min-h-[80vh] py-8 px-2 md:px-8">
      {user && (
        <aside className="hidden md:flex w-64 flex-shrink-0 h-full fixed left-0 top-0 pt-[96px] z-30">
          {/* pt-[96px] to offset navbar if needed, adjust as per your navbar height */}
          <Sidebar />
        </aside>
      )}
      <div className={`flex-1 ${user ? 'md:ml-64' : ''}`}> 
        <div className="w-full max-w-7xl mx-auto p-2 md:p-6 flex-1">
          <Routes>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="products" element={
              <div className="h-full max-h-[calc(100vh-120px)] overflow-auto">
                <Products cart={cart} setCart={setCart} />
              </div>
            } />
            <Route path="profile" element={<Profile />} />
            <Route path="manage-addresses" element={<ManageAddresses />} />
            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default ProductsLayout;
