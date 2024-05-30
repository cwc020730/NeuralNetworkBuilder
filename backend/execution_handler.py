"""
The execution_handler.py file contains the ExecutionHandler class, 
which is responsible for executing the operations of the units on the canvas.
"""

from flask import jsonify
from .unit_object_allocator import UnitObjectAllocator
from .app import socketio
from .unit_objects.input_unit_objects.random_input_unit import RandomInputUnit

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
        for unit_id, unit_info in self.simplified_data.items():
            unit_object = UnitObjectAllocator.create_unit_object(unit_id, unit_info)
            output = unit_object.execute()
            for output_name, output_data in output.items():
                output_data_json = output_data.to_json_dict()
                output[output_name] = output_data_json
            unit_data = {
                unit_id: output
            }
            self.send_unit_data(unit_data)

            print(f'Executing unit: {unit_object}')
            print(f'Output: {unit_object.execute()}')

    def summary(self):
        """
        This method prints a summary of the execution process.
        """
        print('Execution completed successfully!')
