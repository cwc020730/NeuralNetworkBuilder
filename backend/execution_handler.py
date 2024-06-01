"""
The execution_handler.py file contains the ExecutionHandler class, 
which is responsible for executing the operations of the units on the canvas.
"""

from .unit_object_allocator import UnitObjectAllocator
from .app import send_unit_data
from . import EmptyData
from .unit_objects.train_start_unit import TrainStartUnit

class ExecutionHandler:
    """
    The ExecutionHandler class is responsible for executing the operations of the units on the canvas.

    Args:
        simplified_data (dict): The simplified version of the JSON data after processing.

    Attributes:
        simplified_data (dict): The simplified version of the JSON data after processing.
    """
    def __init__(self, simplified_data: dict):
        self.simplified_data = simplified_data
        self.execute_operations()

    def execute_operations(self):
        """
        This method executes the operations of the units on the canvas.
        """
        # look for the input unit
        for unit_id, unit_info in self.simplified_data.items():
            if unit_info['input_unit']:
                input_unit_id = unit_id
                break

        # Input cache to store inputs for each unit
        input_cache = {unit_id: {} for unit_id in self.simplified_data}
        
        def exec_traverse(unit_id, input_data):
            unit_info = self.simplified_data[unit_id]
            # Check if the unit is a train start unit
            if unit_info['type'] == 'train start':
                unit_object = TrainStartUnit(unit_id, unit_info, self.simplified_data)
                output = unit_object(input_data)
                output_connections = unit_object.end_unit_connections
            else:
                unit_object = UnitObjectAllocator.create_unit_object(unit_id, unit_info)
                output = unit_object.execute(input_data)
                output_connections = unit_info['outputs']
                output_to_send = {}
                for output_name, output_data in output.items():
                    output_data_json = output_data.to_json_dict()
                    output_to_send[output_name] = output_data_json
                unit_data = {
                    unit_id: output_to_send
                }
                send_unit_data(unit_data)
            print(f'Executing unit: {unit_object}')

            for connection in output_connections:
                input_for_next_unit = output[connection['name']]
                next_unit_id = connection['connects_to']
                next_unit_input_name_to_connect = connection['end_name']
                input_cache[next_unit_id][next_unit_input_name_to_connect] = input_for_next_unit
                # Check if all inputs for the next unit are ready
                if len(input_cache[next_unit_id]) == len(self.simplified_data[next_unit_id]['inputs']):
                    exec_traverse(next_unit_id, input_cache[next_unit_id])
        
        exec_traverse(input_unit_id, {'null': EmptyData()})

    def summary(self):
        """
        This method prints a summary of the execution process.
        """
        print('Execution completed successfully!')
