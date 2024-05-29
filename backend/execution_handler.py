"""
The execution_handler.py file contains the ExecutionHandler class, 
which is responsible for executing the operations of the units on the canvas.
"""

from unit_objects.input_unit_objects.random_input_unit import RandomInputUnit
from flask import jsonify
from app import app, socketio
import torch
import copy

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
        unit_data_copy = copy.deepcopy(unit_data)
        for output_label, output_data in unit_data_copy['output'].items():
            if isinstance(output_data["value"], torch.Tensor):
                unit_data_copy['output'][output_label]["min"] = output_data["value"].min().item()
                unit_data_copy['output'][output_label]["max"] = output_data["value"].max().item()
                unit_data_copy['output'][output_label]["mean"] = output_data["value"].mean().item()
                unit_data_copy['output'][output_label]["std"] = output_data["value"].std().item()
                unit_data_copy['output'][output_label]["shape"] = output_data["value"].shape
                unit_data_copy['output'][output_label]["value"] = output_data["value"].tolist()
        socketio.emit('data_updated', {'data': unit_data_copy})
        return jsonify({'unit_data': unit_data_copy})

    def execute_operations(self):
        """
        This method executes the operations of the units on the canvas.
        """
        for unit_id, unit_info in self.simplified_data.items():
            unit_object = self.create_unit_object(unit_id, unit_info)
            output = unit_object.execute()
            unit_data = {
                'unit_id': unit_id,
                'output': output
            }
            self.send_unit_data(unit_data)

            print(f'Executing unit: {unit_object}')
            print(f'Output: {unit_object.execute()}')

    def create_unit_object(self, unit_id: str, unit_info: dict):
        """
        This method creates an object of the appropriate unit type based on the unit information.

        Args:
            unit_id (str): The unique identifier for the unit.
            unit_info (dict): A dictionary containing information about the unit.

        Returns:
            Unit: An object of the appropriate unit type.
        """
        unit_type = unit_info['type']
        if unit_type == 'randomInput':
            shape = tuple([int(dim) for dim in unit_info['parameters']['dimension']['value']])
            return RandomInputUnit(unit_id, unit_info, shape)
        else:
            raise ValueError(f'Invalid unit type: {unit_type}')

    def summary(self):
        """
        This method prints a summary of the execution process.
        """
        print('Execution completed successfully!')
