"""
The execution_handler.py file contains the ExecutionHandler class, 
which is responsible for executing the operations of the units on the canvas.
"""

from flask import jsonify
from .unit_object_allocator import UnitObjectAllocator
from .app import socketio
from .unit_objects.input_unit_objects.random_input_unit import RandomInputUnit
from .data_objects.empty_data import EmptyData

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

    def send_unit_data(self, unit_data):
        """
        Send unit data to the client via WebSocket.
        """
        print('Sending unit data to client...', unit_data)
        socketio.emit('data_updated', {'data': unit_data})
        return jsonify({'unit_data': unit_data})

    def execute_operations(self):
        """
        This method executes the operations of the units on the canvas.
        """
        # look for the input unit
        for unit_id, unit_info in self.simplified_data.items():
            if unit_info['input_unit']:
                input_unit_id = unit_id
                break
        
        def exec_traverse(unit_id, input_data):
            unit_info = self.simplified_data[unit_id]
            unit_object = UnitObjectAllocator.create_unit_object(unit_id, unit_info)
            output = unit_object.execute()
            output_to_send = {}
            for output_name, output_data in output.items():
                output_data_json = output_data.to_json_dict()
                output_to_send[output_name] = output_data_json
            unit_data = {
                unit_id: output_to_send
            }
            self.send_unit_data(unit_data)
            print(f'Executing unit: {unit_object}')
            print(f'Output: {unit_object.execute()}')

            for next_unit_id in unit_info['outputs']:
                exec_traverse(next_unit_id, output)
        
        exec_traverse(input_unit_id, EmptyData())

    def summary(self):
        """
        This method prints a summary of the execution process.
        """
        print('Execution completed successfully!')
