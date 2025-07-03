import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../slices/productsSlice";
import { addToCart } from "../../slices/cartSlice";
import ProductCard from "./ProductCard";
import ProductDetails from "./ProductDetails";
import { useNavigate } from "react-router-dom";

const Products = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const productsRaw = useSelector((state) => state.products.items);
  const products = Array.isArray(productsRaw) ? productsRaw : [];
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleProductClick = (product) => setSelectedProduct(product);
  const handleCloseDetails = () => setSelectedProduct(null);
  const handleAddToCart = (product) => {
    if (!user || !user._id) {
      alert("Please log in or sign up to add items to your cart.");
      return;
    }
    dispatch(addToCart({ ...product, id: product._id, quantity: 1, price: product.price }));
    setSelectedProduct(null);
    navigate("/cart");
  };

  return (
    <div className="min-h-[80vh] bg-gradient-to-br from-blue-50 via-pink-50 to-yellow-50 py-6 px-2 md:px-8 mx-auto pt-[10px]">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8 p-6 max-w-7xl w-full mx-auto mt-[20px]">
        {products.map((product) => (
          <ProductCard className="transition-transform duration-200 hover:scale-105 shadow-xl rounded-2xl w-full"
            key={product._id}
            product={product}
            onImageClick={() => handleProductClick(product)}
            onAddToCart={() => handleAddToCart(product)}
          />
        ))}
      </div>
      {selectedProduct && (
        <ProductDetails
          product={selectedProduct}
          onAddToCart={() => handleAddToCart(selectedProduct)}
          onClose={handleCloseDetails}
        />
      )}
    </div>
  );
};

export default Products;
