import React from "react";

const ProductCard = ({ product, onImageClick, onAddToCart }) => (
  <div className="bg-white rounded-2xl shadow-lg p-4 flex flex-col items-center hover:scale-105 transition-transform duration-200">
    <img
      src={product.image || product?.image}
      alt={product.name || product?.name}
      className="w-32 h-32 object-contain mb-4 rounded-xl bg-gray-100 cursor-pointer hover:shadow-lg transition"
      onClick={onImageClick}
      title="View Details"
    />
    <h3 className="text-lg font-bold mb-2 text-gray-800">{product.name || product?.name}</h3>
    <p className="text-gray-600 mb-2">{product.category || product?.category}</p>
    <span className="text-xl font-bold text-blue-500 mb-2">${product.price ?? product?.price}</span>
    <button
      className="mt-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 via-pink-400 to-yellow-400 text-white font-semibold shadow-md hover:scale-105 transition-transform duration-200"
      onClick={() => onAddToCart(product)}
    >
      Add to Cart
    </button>
  </div>
);

export default ProductCard;
