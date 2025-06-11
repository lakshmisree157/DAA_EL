import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import OptimizePage from './pages/OptimizePage';
import CargoOptimizerPage from './pages/CargoOptimizerPage';
import ResultsPage from './pages/ResultsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CargoOptimizerPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/optimize" element={<OptimizePage />} />
        <Route path="/results" element={<ResultsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
