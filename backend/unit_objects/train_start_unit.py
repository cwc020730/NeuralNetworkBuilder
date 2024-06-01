"""
This file contains the TrainStartUnit class, which is a subclass of the Unit class.
"""

import torch.nn as nn
from . import Unit
from .model_end_unit import ModelEndUnit
from ..app import send_unit_data
from ..unit_object_allocator import UnitObjectAllocator

class TrainStartUnit(Unit, nn.Module):
    """
    The TrainStartUnit class is a subclass of the Unit class.

    Args:
        unit_id (str): The ID of the unit.
        unit_info (dict): The information of the unit.
        all_units_data (dict): The data of all the units.

    Attributes:
        unit_id (str): The ID of the unit.
        unit_info (dict): The information of the unit.
        all_units_data (dict): The data of all the units.
    """
    def __init__(self, unit_id: str, unit_info: dict, all_units_data: dict):
        Unit.__init__(self, unit_id, unit_info)
        nn.Module.__init__(self)
        self.all_units_data = all_units_data
        self.end_unit_connections = None
        self.epochs = unit_info['parameters']['epochs']
        self.device = unit_info['parameters']['device']

    def get_training_config(self):
        """
        Get the training configuration.

        Returns:
            dict: The training configuration.
        """
        return (self.epochs, self.device)

    def forward(self, x):
        """
        PyTorch forward method.
        """
        # Input cache to store inputs for each unit
        input_cache = {unit_id: {} for unit_id in self.all_units_data}
        end_unit_output = None

        def traverse(unit_id, input_data):
            unit_info = self.all_units_data[unit_id]
            module_unit_object = UnitObjectAllocator.create_unit_object(unit_id, unit_info)
            if isinstance(module_unit_object, ModelEndUnit):
                nonlocal end_unit_output
                end_unit_output = module_unit_object.execute(input_data)
                self.end_unit_connections = unit_info['outputs']
                send_unit_data({unit_id: {"Model output": end_unit_output["Model output"].to_json_dict()}})
                print(f'Executing unit: {module_unit_object}')
                return
            # register the module object
            assert isinstance(module_unit_object, nn.Module)
            self.add_module(unit_id, module_unit_object)
            output = module_unit_object(input_data)
            output_to_send = {}
            for output_name, output_data in output.items():
                output_data_json = output_data.to_json_dict()
                output_to_send[output_name] = output_data_json
            unit_data = {
                unit_id: output_to_send
            }
            send_unit_data(unit_data)
            print(f'Executing unit: {module_unit_object}')

            for connection in unit_info['outputs']:
                input_for_next_unit = output[connection['name']]
                next_unit_id = connection['connects_to']
                next_unit_input_name_to_connect = connection['end_name']
                input_cache[next_unit_id][next_unit_input_name_to_connect] = input_for_next_unit
                # Check if all inputs for the next unit are ready
                if len(input_cache[next_unit_id]) == len(self.all_units_data[next_unit_id]['inputs']):
                    traverse(next_unit_id, input_cache[next_unit_id])

        # send unit data of itself
        optimizer_unit_id = None
        for connection in self.output_connections:
            if connection['name'] == "Optimizer connector":
                optimizer_unit_id = connection['connects_to']
                break
        self_data_to_send = {
            "Data": x["Data"].to_json_dict(),
            "Optimizer connector": optimizer_unit_id
        }
        send_unit_data({self.id: self_data_to_send})
        # get the next unit id and input name to connect
        self_info = self.all_units_data[self.id]
        self_outputs = self_info['outputs']
        for connection in self_outputs:
            if connection['name'] == "Data":
                end_name = connection['end_name']
                data = x['Data']
                traverse(connection['connects_to'], {end_name: data})
                break
            
        x = end_unit_output
        
        return x

    def execute(self, input_data: dict) -> dict:
        """
        This method is unnecessary for this unit.
        """
        raise AssertionError('This method should not be called.')
    
    def __repr__(self):
        return f'TrainStartUnit ID: {self.id}'