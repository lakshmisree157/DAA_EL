import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const CargoOptimizerPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gradient-to-r from-blue-100 via-white to-green-100 p-8">
        <section className="max-w-6xl mx-auto text-center py-20">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-6">
            CargoOptimizer
          </h1>
          <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
            Intelligent Food Cargo Packing using Dynamic Algorithmic Approaches to maximize nutritional value within weight limits.
          </p>
          <Link to="/optimize">
            <button className="px-8 py-4 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 transition">
              Get Started with Optimization
            </button>
          </Link>
        </section>

        <section className="max-w-6xl mx-auto py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4">Advanced Algorithms</h2>
            <p>
              Compare Greedy, Brute Force, Dynamic Programming, and Fractional Knapsack algorithms to find the best cargo packing solution.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4">Interactive Visualizations</h2>
            <p>
              Visualize nutritional values, cargo weight usage, and algorithm performance with dynamic charts and tables.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4">Downloadable Reports</h2>
            <p>
              Generate and download detailed PDF summaries of your optimization results for easy sharing and documentation.
            </p>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-gray-300 py-6 text-center">
        &copy; 2024 CargoOptimizer. All rights reserved.
      </footer>
    </div>
  );
};

export default CargoOptimizerPage;
