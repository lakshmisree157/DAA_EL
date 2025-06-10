from flask import Flask, request, jsonify
from flask_cors import CORS
from knapsack import KnapsackOptimizer

app = Flask(__name__)
CORS(app)

@app.route('/optimize/comparison', methods=['POST'])
def optimize_comparison():
    """
    Main endpoint for comparing Brute Force vs Hybrid approach.
    This is your core logic comparison.
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No JSON data provided'}), 400
        
        items = data.get('items')
        max_weight = data.get('max_weight')
        
        if not items or not isinstance(items, list):
            return jsonify({'error': 'Items must be a non-empty list'}), 400
        
        if not isinstance(max_weight, (int, float)) or max_weight <= 0:
            return jsonify({'error': 'max_weight must be a positive number'}), 400
        
        optimizer = KnapsackOptimizer()
        results = optimizer.optimize_comparison(items, max_weight)
        
        return jsonify({
            'success': True,
            'results': results,
            'explanation': {
                'brute_force': 'Treats all items as indivisible (0/1 knapsack for everything)',
                'hybrid_optimal': 'Uses 0/1 knapsack for packed items and fractional knapsack for bulk items',
                'comparison_purpose': 'Shows the difference between treating all items as packed vs respecting their bulk/packed nature'
            }
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/optimize/brute-force', methods=['POST'])
def optimize_brute_force():
    """
    Endpoint for brute force algorithm only.
    """
    try:
        data = request.get_json()
        items = data.get('items')
        max_weight = data.get('max_weight')
        
        optimizer = KnapsackOptimizer()
        result = optimizer.brute_force_knapsack_with_backtrack(items, max_weight)
        
        return jsonify({
            'success': True,
            'result': result,
            'algorithm': 'Brute Force - treats all items as indivisible'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/optimize/hybrid', methods=['POST'])
def optimize_hybrid():
    """
    Endpoint for hybrid algorithm only.
    """
    try:
        data = request.get_json()
        items = data.get('items')
        max_weight = data.get('max_weight')
        
        optimizer = KnapsackOptimizer()
        result = optimizer.hybrid_knapsack_with_backtrack(items, max_weight)
        
        return jsonify({
            'success': True,
            'result': result,
            'algorithm': 'Hybrid - 0/1 for packed + fractional for bulk'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/optimize/greedy', methods=['POST'])
def optimize_greedy():
    """
    Endpoint for greedy algorithm only.
    """
    try:
        data = request.get_json()
        items = data.get('items')
        max_weight = data.get('max_weight')
        
        optimizer = KnapsackOptimizer()
        result = optimizer.greedy_knapsack_with_backtrack(items, max_weight)
        
        return jsonify({
            'success': True,
            'result': result,
            'algorithm': 'Greedy - based on value/weight ratio'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/backtrack/detailed', methods=['POST'])
def get_detailed_backtrack():
    """
    Get detailed backtracking information for educational purposes.
    """
    try:
        data = request.get_json()
        items = data.get('items')
        max_weight = data.get('max_weight')
        algorithm = data.get('algorithm', 'hybrid')  # default to hybrid
        
        optimizer = KnapsackOptimizer()
        
        if algorithm == 'brute_force':
            result = optimizer.brute_force_knapsack_with_backtrack(items, max_weight)
        elif algorithm == 'hybrid':
            result = optimizer.hybrid_knapsack_with_backtrack(items, max_weight)
        elif algorithm == 'greedy':
            result = optimizer.greedy_knapsack_with_backtrack(items, max_weight)
        else:
            return jsonify({'error': 'Invalid algorithm. Choose: brute_force, hybrid, or greedy'}), 400
        
        return jsonify({
            'success': True,
            'backtrack_details': result.get('backtrack_info', {}),
            'algorithm_used': result.get('algorithm_used', algorithm),
            'execution_time_ms': result.get('execution_time_ms', 0),
            'total_value': result.get('total_nutritional_value', 0),
            'total_weight': result.get('total_weight', 0)
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Legacy endpoints for backward compatibility
@app.route('/optimize/all', methods=['POST'])
def optimize_all():
    """Legacy endpoint - redirects to comparison."""
    return optimize_comparison()

@app.route('/optimize', methods=['POST'])
def optimize():
    """Legacy endpoint - returns hybrid approach."""
    return optimize_hybrid()

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({
        'status': 'healthy',
        'available_endpoints': [
            '/optimize/comparison - Main comparison between brute force and hybrid',
            '/optimize/brute-force - Brute force algorithm only',
            '/optimize/hybrid - Hybrid algorithm only',
            '/optimize/greedy - Greedy algorithm only',
            '/backtrack/detailed - Detailed backtracking information',
            '/health - This health check'
        ]
    })

@app.route('/test/sample', methods=['GET'])
def test_sample():
    """Endpoint to test with sample data."""
    sample_items = [
        {'name': 'Rice', 'weight': 10, 'nutritional_value': 50, 'is_bulk': True},
        {'name': 'Beans', 'weight': 5, 'nutritional_value': 30, 'is_bulk': True},
        {'name': 'Canned Soup', 'weight': 2, 'nutritional_value': 15, 'is_bulk': False},
        {'name': 'Energy Bar', 'weight': 1, 'nutritional_value': 12, 'is_bulk': False},
        {'name': 'Pasta', 'weight': 3, 'nutritional_value': 25, 'is_bulk': True},
        {'name': 'Protein Powder', 'weight': 4, 'nutritional_value': 35, 'is_bulk': True},
        {'name': 'Canned Meat', 'weight': 3, 'nutritional_value': 28, 'is_bulk': False}
    ]
    
    max_weight = 15
    
    optimizer = KnapsackOptimizer()
    results = optimizer.optimize_comparison(sample_items, max_weight)
    
    return jsonify({
        'success': True,
        'sample_data': {
            'items': sample_items,
            'max_weight': max_weight
        },
        'results': results
    })

if __name__ == '__main__':
    print("🚀 Knapsack Optimizer Server Starting...")
    print("📊 Core Logic: Comparing Brute Force vs Hybrid Approach")
    print("🔍 Brute Force: Treats ALL items as indivisible (0/1 knapsack)")
    print("⚡ Hybrid: 0/1 knapsack for packed + fractional knapsack for bulk")
    print("🌐 Server running on http://localhost:5000")
    print("\n📝 Main endpoint: POST /optimize/comparison")
    
    app.run(port=5000)