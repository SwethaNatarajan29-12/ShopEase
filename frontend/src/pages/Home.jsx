// pages/Home.jsx
import React from "react";
import { motion } from "framer-motion";

const Home = () => {
  return (
    <motion.div
      className="text-center"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h1 className="text-4xl font-bold text-primary mb-4">Welcome to ShopEase</h1>
      <p className="text-lg text-base-content">
        Discover the best online deals tailored for you!
      </p>
      <img
        src="https://source.unsplash.com/featured/?shopping"
        alt="Shopping"
        className="mt-6 mx-auto rounded-lg shadow-lg max-w-xl"
      />
    </motion.div>
  );
};

export default Home;
