from typing import List, Dict, Any, Optional, Tuple
import time
from itertools import combinations


class KnapsackOptimizer:
    def __init__(self) -> None:
        pass

    def optimize_comparison(self, items: List[Dict[str, Any]], max_weight: float, max_transport_duration: Optional[float] = None, allowed_storage_types: Optional[List[str]] = None) -> Dict[str, Any]:
        """
        Main method to compare Brute Force vs Hybrid (0/1 + Fractional) approach.
        
        Args:
            items: List of food items with properties (name, weight, nutritional_value, is_bulk, transport_duration, storage_requirements)
            max_weight: Maximum cargo weight capacity
            max_transport_duration: Optional max allowed transport duration (days)
            allowed_storage_types: Optional list of allowed storage types

        Returns:
            Dictionary containing comparison results between two approaches
        """
        if not isinstance(items, list) or not all(isinstance(item, dict) for item in items):
            raise ValueError("Items must be a list of dictionaries.")
        if not isinstance(max_weight, (int, float)) or max_weight < 0:
            raise ValueError("max_weight must be a non-negative number.")

        # Filter items based on max_transport_duration and allowed_storage_types
        filtered_items = []
        for item in items:
            transport_ok = True
            storage_ok = True

            if max_transport_duration is not None:
                transport_duration = item.get('transport_duration')
                if transport_duration is not None and transport_duration > max_transport_duration:
                    transport_ok = False

            if allowed_storage_types is not None and len(allowed_storage_types) > 0:
                storage_req = item.get('storage_requirements')
                if storage_req is not None and storage_req not in allowed_storage_types:
                    storage_ok = False

            if transport_ok and storage_ok:
                filtered_items.append(item)

        # Approach 1: Brute Force (all items treated as packed/indivisible)
        brute_force_result = self.brute_force_knapsack_with_backtrack(filtered_items, max_weight)
        
        # Approach 2: Hybrid (0/1 for packed + Fractional for bulk)
        hybrid_result = self.hybrid_knapsack_with_backtrack(filtered_items, max_weight)
        
        # Additional algorithms for reference
        greedy_result = self.greedy_knapsack_with_backtrack(filtered_items, max_weight)
        
        # Attach input_items to each result for frontend navigation
        for result in [brute_force_result, hybrid_result, greedy_result]:
            result['input_items'] = filtered_items.copy()
        
        return {
            'comparison': {
                'brute_force': brute_force_result,
                'hybrid_optimal': hybrid_result,
                'greedy_reference': greedy_result
            },
            'summary': {
                'brute_force_value': brute_force_result['total_nutritional_value'],
                'hybrid_value': hybrid_result['total_nutritional_value'],
                'greedy_value': greedy_result['total_nutritional_value'],
                'best_approach': self._determine_best_approach(brute_force_result, hybrid_result, greedy_result),
                'value_difference': abs(brute_force_result['total_nutritional_value'] - hybrid_result['total_nutritional_value']),
                'time_comparison': {
                    'brute_force_ms': brute_force_result['execution_time_ms'],
                    'hybrid_ms': hybrid_result['execution_time_ms'],
                    'greedy_ms': greedy_result['execution_time_ms']
                }
            }
        }

    def hybrid_knapsack_with_backtrack(self, items: List[Dict[str, Any]], max_weight: float) -> Dict[str, Any]:
        """
        Hybrid approach: 0/1 knapsack for packed items + Fractional knapsack for bulk items.
        Includes detailed backtracking information.
        """
        start_time = time.time()
        
        # Separate items
        bulk_items = [item for item in items if item.get('is_bulk', False)]
        packed_items = [item for item in items if not item.get('is_bulk', False)]
        
        # Step 1: Process packed items with 0/1 knapsack
        packed_result = self._zero_one_knapsack_with_backtrack(packed_items, max_weight)
        remaining_weight = max_weight - packed_result['total_weight']
        
        # Step 2: Process bulk items with remaining weight using fractional knapsack
        bulk_result = self._fractional_knapsack_with_backtrack(bulk_items, remaining_weight)
        
        end_time = time.time()
        
        return {
            'selected_items': packed_result['selected_items'] + bulk_result['selected_items'],
            'not_selected_items': packed_result['not_selected_items'] + bulk_result['not_selected_items'],
            'total_weight': packed_result['total_weight'] + bulk_result['total_weight'],
            'total_nutritional_value': packed_result['total_nutritional_value'] + bulk_result['total_nutritional_value'],
            'algorithm_used': 'Hybrid: 0/1 Knapsack + Fractional Knapsack',
            'execution_time_ms': (end_time - start_time) * 1000,
            'backtrack_info': {
                'packed_items_processing': packed_result['backtrack_info'],
                'bulk_items_processing': bulk_result['backtrack_info'],
                'weight_allocation': {
                    'total_capacity': max_weight,
                    'used_by_packed': packed_result['total_weight'],
                    'used_by_bulk': bulk_result['total_weight'],
                    'remaining': max_weight - (packed_result['total_weight'] + bulk_result['total_weight'])
                }
            },
            'efficiency_remarks': 'Optimal hybrid approach: exact solution for packed items, optimal fractional for bulk items.'
        }

    def _zero_one_knapsack_with_backtrack(self, items: List[Dict[str, Any]], max_weight: float) -> Dict[str, Any]:
        """
        0/1 knapsack with detailed backtracking information.
        """
        if not items or max_weight <= 0:
            return {
                'selected_items': [],
                'not_selected_items': items.copy(),
                'total_weight': 0,
                'total_nutritional_value': 0,
                'backtrack_info': {'steps': [], 'dp_table_size': '0x0'}
            }

        n = len(items)
        max_weight_int = int(max_weight)
        
        # Create DP table
        dp = [[0 for _ in range(max_weight_int + 1)] for _ in range(n + 1)]
        
        # Fill the DP table with tracking
        dp_steps = []
        for i in range(1, n + 1):
            weight = int(items[i-1]['weight'])
            value = items[i-1]['nutritional_value']
            
            for w in range(max_weight_int + 1):
                if weight <= w:
                    include_value = dp[i-1][w-weight] + value
                    exclude_value = dp[i-1][w]
                    if include_value > exclude_value:
                        dp[i][w] = include_value
                        dp_steps.append({
                            'item': items[i-1]['name'],
                            'weight_limit': w,
                            'decision': 'include',
                            'value_gained': value
                        })
                    else:
                        dp[i][w] = exclude_value
                        if w == max_weight_int:  # Only log for final weight
                            dp_steps.append({
                                'item': items[i-1]['name'],
                                'weight_limit': w,
                                'decision': 'exclude',
                                'reason': f'Including gives {include_value}, excluding gives {exclude_value}'
                            })
                else:
                    dp[i][w] = dp[i-1][w]

        # Backtrack to find selected items
        selected_items = []
        not_selected_items = []
        backtrack_steps = []
        w = max_weight_int
        
        for i in range(n, 0, -1):
            if dp[i][w] != dp[i-1][w]:
                item = items[i-1]
                selected_items.append({
                    'name': item['name'],
                    'weight': item['weight'],
                    'nutritional_value': item['nutritional_value'],
                    'fraction': 1.0,
                    'algorithm': '0/1 Knapsack (Dynamic Programming)',
                    'selection_reason': f'Optimal choice at weight limit {w}'
                })
                backtrack_steps.append({
                    'step': len(selected_items),
                    'item_selected': item['name'],
                    'remaining_weight': w - int(item['weight']),
                    'value_contribution': item['nutritional_value']
                })
                w -= int(item['weight'])
            else:
                not_selected_items.append(items[i-1])
                backtrack_steps.append({
                    'step': len(backtrack_steps) + 1,
                    'item_rejected': items[i-1]['name'],
                    'reason': 'Not optimal to include'
                })

        return {
            'selected_items': selected_items,
            'not_selected_items': not_selected_items,
            'total_weight': sum(item['weight'] for item in selected_items),
            'total_nutritional_value': dp[n][max_weight_int],
            'backtrack_info': {
                'dp_table_size': f'{n+1}x{max_weight_int+1}',
                'dp_filling_steps': dp_steps[-10:],  # Last 10 steps to avoid too much data
                'backtrack_steps': backtrack_steps,
                'final_dp_value': dp[n][max_weight_int],
                'dp_matrix': dp,  # Full DP table for visualization
                'item_names': [item['name'] for item in items]  # Item names for row labels
            }
        }

    def _fractional_knapsack_with_backtrack(self, items: List[Dict[str, Any]], max_weight: float) -> Dict[str, Any]:
        """
        Fractional knapsack with detailed backtracking information.
        """
        if not items or max_weight <= 0:
            return {
                'selected_items': [],
                'not_selected_items': items.copy(),
                'total_weight': 0,
                'total_nutritional_value': 0,
                'backtrack_info': {'steps': [], 'sorting_order': []}
            }

        # Calculate value-to-weight ratios and sort
        items_with_ratio = [
            (item, item['nutritional_value'] / item['weight']) for item in items if item['weight'] > 0
        ]
        sorted_items = sorted(items_with_ratio, key=lambda x: x[1], reverse=True)
        
        sorting_info = [{
            'name': item[0]['name'],
            'ratio': round(item[1], 3),
            'weight': item[0]['weight'],
            'value': item[0]['nutritional_value']
        } for item in sorted_items]

        selected_items = []
        not_selected_items = []
        remaining_weight = max_weight
        total_nutritional_value = 0
        processing_steps = []

        for i, (item, ratio) in enumerate(sorted_items):
            if remaining_weight <= 0:
                not_selected_items.append(item)
                processing_steps.append({
                    'step': i + 1,
                    'item': item['name'],
                    'action': 'rejected',
                    'reason': 'No remaining capacity'
                })
                continue

            if item['weight'] <= remaining_weight and remaining_weight > 0:
                # Take the whole item
                selected_items.append({
                    'name': item['name'],
                    'weight': item['weight'],
                    'nutritional_value': item['nutritional_value'],
                    'fraction': 1.0,
                    'algorithm': 'Fractional Knapsack (Greedy)',
                    'selection_reason': f'Whole item fits, ratio: {round(ratio, 3)}'
                })
                remaining_weight -= item['weight']
                total_nutritional_value += item['nutritional_value']
                processing_steps.append({
                    'step': i + 1,
                    'item': item['name'],
                    'action': 'fully_selected',
                    'weight_used': item['weight'],
                    'value_gained': item['nutritional_value'],
                    'remaining_capacity': remaining_weight
                })
            elif remaining_weight > 0:
                # Take a fraction of the item
                fraction = remaining_weight / item['weight']
                if fraction > 1:
                    fraction = 1.0
                fractional_value = item['nutritional_value'] * fraction
                selected_items.append({
                    'name': item['name'],
                    'weight': remaining_weight,
                    'nutritional_value': fractional_value,
                    'fraction': fraction,
                    'algorithm': 'Fractional Knapsack (Greedy)',
                    'selection_reason': f'Fractional selection: {round(fraction*100, 1)}% of item'
                })
                total_nutritional_value += fractional_value
                processing_steps.append({
                    'step': i + 1,
                    'item': item['name'],
                    'action': 'partially_selected',
                    'fraction': round(fraction, 3),
                    'weight_used': remaining_weight,
                    'value_gained': round(fractional_value, 2),
                    'remaining_capacity': 0
                })
                
                # Add remaining portion to not selected
                remaining_item = item.copy()
                remaining_item['weight'] = item['weight'] - remaining_weight
                remaining_item['nutritional_value'] = item['nutritional_value'] * (1 - fraction)
                not_selected_items.append(remaining_item)
                remaining_weight = 0

        # Add items that weren't processed due to no capacity
        for item, _ in sorted_items[len(processing_steps):]:
            not_selected_items.append(item)

        return {
            'selected_items': selected_items,
            'not_selected_items': not_selected_items,
            'total_weight': max_weight - remaining_weight,
            'total_nutritional_value': total_nutritional_value,
            'backtrack_info': {
                'sorting_order': sorting_info,
                'processing_steps': processing_steps,
                'greedy_strategy': 'Items sorted by value/weight ratio in descending order'
            }
        }

    def brute_force_knapsack_with_backtrack(self, items: List[Dict[str, Any]], max_weight: float) -> Dict[str, Any]:
        """
        Brute force knapsack with detailed backtracking information.
        """
        start_time = time.time()
        
        if not items or max_weight <= 0:
            return {
                'selected_items': [],
                'not_selected_items': items.copy(),
                'total_weight': 0,
                'total_nutritional_value': 0,
                'algorithm_used': 'Brute Force',
                'execution_time_ms': 0,
                'backtrack_info': {'combinations_tested': 0, 'best_combination_found': 'None'},
                'efficiency_remarks': 'No valid combinations possible.'
            }

        n = len(items)
        best_value = 0
        best_combination = []
        combinations_tested = 0
        tested_combinations = []

        # Check all possible combinations
        for r in range(1, n + 1):
            for combo in combinations(items, r):
                combinations_tested += 1
                total_weight = sum(item['weight'] for item in combo)
                total_value = sum(item['nutritional_value'] for item in combo)
                
                combo_info = {
                    'combination_id': combinations_tested,
                    'items': [item['name'] for item in combo],
                    'total_weight': total_weight,
                    'total_value': total_value,
                    'feasible': total_weight <= max_weight
                }
                
                if total_weight <= max_weight:
                    combo_info['status'] = 'feasible'
                    if total_value > best_value:
                        best_value = total_value
                        best_combination = combo
                        combo_info['is_best_so_far'] = True
                    else:
                        combo_info['is_best_so_far'] = False
                else:
                    combo_info['status'] = 'exceeds_weight'
                
                # Store only first 20 and last 10 combinations to avoid memory issues
                if combinations_tested <= 20 or combinations_tested > (2**n - 10):
                    tested_combinations.append(combo_info)

        # Prepare selected and not selected items
        selected_items = [{
            'name': item['name'],
            'weight': item['weight'],
            'nutritional_value': item['nutritional_value'],
            'fraction': 1.0,
            'algorithm': 'Brute Force',
            'selection_reason': f'Part of optimal combination found after testing {combinations_tested} combinations'
        } for item in best_combination]

        selected_names = set(item['name'] for item in best_combination)
        not_selected_items = [item for item in items if item['name'] not in selected_names]

        end_time = time.time()

        return {
            'selected_items': selected_items,
            'not_selected_items': not_selected_items,
            'total_weight': sum(item['weight'] for item in selected_items),
            'total_nutritional_value': best_value,
            'algorithm_used': 'Brute Force',
            'execution_time_ms': (end_time - start_time) * 1000,
            'backtrack_info': {
                'combinations_tested': combinations_tested,
                'total_possible_combinations': 2**n - 1,
                'best_combination_found': [item['name'] for item in best_combination],
                'sample_combinations': tested_combinations,
                'search_complexity': f'O(2^{n}) = {2**n - 1} combinations'
            },
            'efficiency_remarks': f'Exhaustive search of all {combinations_tested} combinations, guarantees optimal solution.'
        }

    def greedy_knapsack_with_backtrack(self, items: List[Dict[str, Any]], max_weight: float) -> Dict[str, Any]:
        """
        Greedy knapsack with backtracking, treats bulk items as fractional.
        """
        start_time = time.time()
        
        if not items or max_weight <= 0:
            return {
                'selected_items': [],
                'not_selected_items': items.copy(),
                'total_weight': 0,
                'total_nutritional_value': 0,
                'algorithm_used': 'Greedy',
                'execution_time_ms': 0,
                'backtrack_info': {'sorting_order': []},
                'efficiency_remarks': 'No items to process.'
            }

        # Sort items by value/weight ratio
        items_with_ratio = [
            (item, item['nutritional_value'] / item['weight']) for item in items if item['weight'] > 0
        ]
        sorted_items = sorted(items_with_ratio, key=lambda x: x[1], reverse=True)
        
        sorting_info = [{
            'name': item[0]['name'],
            'ratio': round(item[1], 3),
            'is_bulk': item[0].get('is_bulk', False),
            'weight': item[0]['weight'],
            'value': item[0]['nutritional_value']
        } for item in sorted_items]

        selected_items = []
        not_selected_items = []
        remaining_weight = max_weight
        total_nutritional_value = 0
        processing_steps = []

        for i, (item, ratio) in enumerate(sorted_items):
            if remaining_weight <= 0:
                not_selected_items.append(item)
                continue

            if item['weight'] <= remaining_weight:
                # Take the whole item
                selected_items.append({
                    'name': item['name'],
                    'weight': item['weight'],
                    'nutritional_value': item['nutritional_value'],
                    'fraction': 1.0,
                    'algorithm': 'Greedy',
                    'selection_reason': f'Highest ratio item that fits: {round(ratio, 3)}'
                })
                remaining_weight -= item['weight']
                total_nutritional_value += item['nutritional_value']
                processing_steps.append({
                    'step': i + 1,
                    'item': item['name'],
                    'action': 'fully_selected',
                    'ratio': round(ratio, 3)
                })
            elif item.get('is_bulk', False):
                # Take fraction of bulk item
                fraction = remaining_weight / item['weight']
                fractional_value = item['nutritional_value'] * fraction
                selected_items.append({
                    'name': item['name'],
                    'weight': remaining_weight,
                    'nutritional_value': fractional_value,
                    'fraction': fraction,
                    'algorithm': 'Greedy',
                    'selection_reason': f'Bulk item - took fraction: {round(fraction*100, 1)}%'
                })
                total_nutritional_value += fractional_value
                processing_steps.append({
                    'step': i + 1,
                    'item': item['name'],
                    'action': 'partially_selected',
                    'fraction': round(fraction, 3)
                })
                remaining_weight = 0
            else:
                # Cannot take packed item
                not_selected_items.append(item)
                processing_steps.append({
                    'step': i + 1,
                    'item': item['name'],
                    'action': 'rejected',
                    'reason': 'Packed item too heavy'
                })

        end_time = time.time()

        return {
            'selected_items': selected_items,
            'not_selected_items': not_selected_items,
            'total_weight': max_weight - remaining_weight,
            'total_nutritional_value': total_nutritional_value,
            'algorithm_used': 'Greedy',
            'execution_time_ms': (end_time - start_time) * 1000,
            'backtrack_info': {
                'sorting_order': sorting_info,
                'processing_steps': processing_steps,
                'strategy': 'Sort by value/weight ratio, select greedily'
            },
            'efficiency_remarks': 'Fast O(n log n) algorithm, not always optimal for 0/1 knapsack.'
        }

    def _determine_best_approach(self, brute_force: Dict, hybrid: Dict, greedy: Dict) -> str:
        """Determine which approach gives the best result."""
        values = {
            'brute_force': brute_force['total_nutritional_value'],
            'hybrid': hybrid['total_nutritional_value'],
            'greedy': greedy['total_nutritional_value']
        }
        
        best_approach = max(values.keys(), key=lambda k: values[k])
        
        if values['brute_force'] == values['hybrid']:
            return 'tie_brute_hybrid'
        elif values['brute_force'] == values['greedy']:
            return 'tie_brute_greedy'
        elif values['hybrid'] == values['greedy']:
            return 'tie_hybrid_greedy'
        else:
            return best_approach


# Legacy methods for backward compatibility
    def optimize(self, items: List[Dict[str, Any]], max_weight: float) -> Dict[str, Any]:
        """Legacy method - returns hybrid approach result."""
        return self.hybrid_knapsack_with_backtrack(items, max_weight)

    def optimize_all(self, items: List[Dict[str, Any]], max_weight: float) -> Dict[str, Any]:
        """Legacy method - returns comparison results."""
        return self.optimize_comparison(items, max_weight)


# Example usage
if __name__ == "__main__":
    # Sample data for testing
    sample_items = [
        {'name': 'Rice', 'weight': 10, 'nutritional_value': 50, 'is_bulk': True},
        {'name': 'Beans', 'weight': 5, 'nutritional_value': 30, 'is_bulk': True},
        {'name': 'Canned Soup', 'weight': 2, 'nutritional_value': 15, 'is_bulk': False},
        {'name': 'Energy Bar', 'weight': 1, 'nutritional_value': 12, 'is_bulk': False},
        {'name': 'Pasta', 'weight': 3, 'nutritional_value': 25, 'is_bulk': True}
    ]
    
    optimizer = KnapsackOptimizer()
    result = optimizer.optimize_comparison(sample_items, 15)
    print("Comparison Result:")
    print(f"Brute Force Value: {result['summary']['brute_force_value']}")
    print(f"Hybrid Optimal Value: {result['summary']['hybrid_value']}")
    print(f"Best Approach: {result['summary']['best_approach']}")