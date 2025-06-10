# NutriCargo Optimizer

## Overview

NutriCargo Optimizer is a web application designed to optimize cargo loading based on nutritional value and weight constraints. It uses multiple optimization algorithms to select items that maximize nutritional value within a given cargo capacity.

The project consists of a backend API service and a React frontend application.

---

## Project Structure

- **backend/**: Python Flask backend providing optimization algorithms and API endpoints.
- **frontend/**: React frontend application for user input, optimization requests, and result visualization.

---

## Backend

### Technologies

- Python 3.x
- Flask
- Optimization algorithms implemented in `backend/knapsack.py`

### API Endpoints

- `POST /optimize/comparison`: Accepts a list of items and max weight, returns optimization results from multiple algorithms including:
  - Brute Force
  - Greedy
  - Hybrid (0/1 Knapsack + Fractional Knapsack)

### Running Backend

1. Navigate to the `backend` directory.
2. Install dependencies (if any).
3. Run the Flask server:
   ```bash
   python server.py
   ```
4. The API will be available at `http://localhost:5000`.

---

## Frontend

### Technologies

- React
- React Router
- Recharts for charts
- Tailwind CSS for styling

### Key Components

- `OptimizePage`: Input page for items and cargo capacity.
- `ResultsPage`: Displays optimization results with charts and detailed item tables.
- `ResultDashboard`: Visualizes results including nutritional value bar chart, selected vs not selected weight double bar chart, and detailed selected items.
- `PDFExportButton`: Allows exporting results as PDF.

### Running Frontend

1. Navigate to the `frontend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
4. Access the app at `http://localhost:3000`.

---

## Usage

1. Open the frontend app.
2. Enter cargo capacity and item details on the Optimize page.
3. Click "Optimize" to run optimization algorithms.
4. View results on the Results page with detailed charts and tables.
5. Export results as PDF if needed.

---

## Testing

- Backend endpoints can be tested using tools like Postman.
- Frontend can be tested by navigating through Optimize and Results pages, verifying charts and tables.

---

## Notes

- Results are displayed on a separate Results page for better user experience.
- Execution time and item selection details are shown for each algorithm.
- The double bar chart compares selected vs not selected item weights per algorithm.

---

## Contact

For questions or support, please contact the project maintainer.
