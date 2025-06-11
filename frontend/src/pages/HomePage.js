import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <h1 className="text-4xl font-bold text-primary-600 mb-6">
        Welcome to NutriCargo Optimizer
      </h1>
      <p className="text-gray-600 mb-8 text-center max-w-xl">
        This tool helps you optimize the cargo of food items to maximize nutritional value without exceeding weight limits. Try the optimization tool below.
      </p>
      <Link to="/optimize">
        <button className="px-6 py-3 bg-primary-600 text-white rounded-lg shadow hover:bg-primary-700 transition">
          Go to Optimizer
        </button>
      </Link>
    </div>
  );
};

export default HomePage;
