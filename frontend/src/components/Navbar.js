import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between">
        <Link to="/" className="text-2xl font-bold text-blue-600">NutriCargo Optimizer</Link>
        <div className="space-x-4">
          <Link to="/" className={`text-gray-700 hover:text-blue-600 ${location.pathname === '/' && 'font-bold'}`}>Home</Link>
          <Link to="/optimize" className={`text-gray-700 hover:text-blue-600 ${location.pathname === '/optimize' && 'font-bold'}`}>Optimize</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
