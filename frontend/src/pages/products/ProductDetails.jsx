import React from "react";

const ProductDetails = ({ product, onAddToCart, onClose }) => {
  if (!product) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full relative animate-pop">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <img src={product.image || product?.image} alt={product.name || product?.name} className="w-40 h-40 object-contain mx-auto mb-4 rounded-xl bg-gray-100" />
        <h2 className="text-2xl font-extrabold text-blue-700 mb-2 text-center">{product.name || product?.name}</h2>
        <div className="text-center text-gray-600 mb-2">{product.category || product?.category}</div>
        <div className="text-center text-lg text-gray-800 mb-4">${product.price ?? product?.price}</div>
        {product.description && <div className="text-center text-gray-500 mb-6">{product.description}</div>}
        <button
          className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 via-pink-400 to-yellow-400 text-white font-bold shadow hover:scale-105 transition-transform duration-200 text-lg"
          onClick={() => onAddToCart(product)}
        >
          Add to Cart
        </button>
      </div>
      <style>{`
        @keyframes pop { 0% { transform: scale(0.8); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        .animate-pop { animation: pop 0.25s cubic-bezier(.4,2,.6,1) both; }
      `}</style>
    </div>
  );
};

export default ProductDetails;
