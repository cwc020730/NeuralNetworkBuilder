"""
This file contains the TrainStartUnit class, which is a subclass of the Unit class.
"""

import asyncio
import torch.nn as nn
from . import Unit
from .model_end_unit import ModelEndUnit
from ..app import send_unit_data, build_and_send_image
from ..unit_object_allocator import UnitObjectAllocator
from ..data_objects import TensorData

class ModelStartUnit(Unit, nn.Module):
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
    def __init__(
        self,
        unit_id: str,
        unit_info: dict,
        all_units_data: dict,
        enable_send_data: bool = True,
        curr_unit_id: list = None
    ):
        if curr_unit_id is None:
            curr_unit_id = []
        Unit.__init__(self, unit_id, unit_info)
        nn.Module.__init__(self)
        self.all_units_data = all_units_data
        self.end_unit_connections = None
        self.epochs = int(unit_info['parameters']['epochs']['value'])
        self.device = unit_info['parameters']['device']['value']
        self.unit_id_to_module = {}
        self.register_modules()
        self.enable_send_data = enable_send_data
        self.curr_unit_id = curr_unit_id

    def toggle_send_data(self):
        """
        This method toggles the send data attribute.
        """
        self.enable_send_data = True

    def get_training_config(self):
        """
        Get the training configuration.

        Returns:
            dict: The training configuration.
        """
        return (self.epochs, self.device)

    def register_modules(self):
        """
        This method preregisters the modules in the model.
        """
        def traverse(unit_id):
            unit_info = self.all_units_data[unit_id]
            if unit_id != self.id:
                module_unit_object = UnitObjectAllocator.create_unit_object(unit_id, unit_info)
                if isinstance(module_unit_object, ModelEndUnit):
                    return
                # register the module object
                assert isinstance(module_unit_object, nn.Module), \
                    f"Module object must be an instance of nn.Module, got {
                        type(module_unit_object)
                    }"
                if unit_id not in self._modules:
                    self.add_module(unit_id, module_unit_object)
                    print(f'Registered module: {module_unit_object}')
                self.unit_id_to_module[unit_id] = module_unit_object
            for connection in unit_info['outputs']:
                if connection['name'] == "Optimizer connector":
                    continue
                traverse(connection['connects_to'])
        traverse(self.id)
        print(f"Registered modules: {self._modules}")

    def forward(self, x):
        """
        PyTorch forward method.
        """
        # Input cache to store inputs for each unit
        input_cache = {unit_id: {} for unit_id in self.all_units_data}
        end_unit_output = None

        def traverse(unit_id, input_data):
            if self.curr_unit_id != []:
                self.curr_unit_id.pop()
            self.curr_unit_id.append(unit_id)
            unit_info = self.all_units_data[unit_id]
            if unit_id in self.unit_id_to_module:
                module_unit_object = self.unit_id_to_module[unit_id]
            else:
                module_unit_object = UnitObjectAllocator.create_unit_object(unit_id, unit_info)
            if isinstance(module_unit_object, ModelEndUnit):
                nonlocal end_unit_output
                end_unit_output = module_unit_object.execute(input_data)
                self.end_unit_connections = unit_info['outputs']
                if self.enable_send_data:
                    asyncio.run(send_unit_data(
                        {
                            unit_id: {
                                "Model output": end_unit_output["Model output"].to_json_dict()
                            }
                        }
                    ))
                # print(f'Executing unit: {module_unit_object}')
                return
            output = module_unit_object(input_data)
            output_to_send = {}
            for output_name, output_data in output.items():
                output_data_json = output_data.to_json_dict()
                # TODO: need to rename output_to_send to something like data_to_send
                output_to_send[output_name] = output_data_json
                if self.enable_send_data:
                    asyncio.run(build_and_send_image(unit_id, output_name, output_data))
            unit_data = {
                unit_id: output_to_send
            }
            if self.enable_send_data:
                asyncio.run(send_unit_data(unit_data))
            # print(f'Executing unit: {module_unit_object}')

            for connection in unit_info['outputs']:
                input_for_next_unit = output[connection['name']]
                next_unit_id = connection['connects_to']
                next_unit_input_name_to_connect = connection['end_name']
                input_cache[next_unit_id][next_unit_input_name_to_connect] = input_for_next_unit
                # Check if all inputs for the next unit are ready
                input_count = len(self.all_units_data[next_unit_id]['inputs'])
                if len(input_cache[next_unit_id]) == input_count:
                    traverse(next_unit_id, input_cache[next_unit_id])

        # send unit data of itself
        optimizer_unit_id = None
        for connection in self.output_connections:
            if connection['name'] == "Optimizer connector":
                optimizer_unit_id = connection['connects_to']
                break
        self_data_to_send = {
            "Data": TensorData(x).to_json_dict(),
            "Optimizer connector": optimizer_unit_id
        }
        if self.enable_send_data:
            asyncio.run(send_unit_data({self.id: self_data_to_send}))
        # get the next unit id and input name to connect
        self_info = self.all_units_data[self.id]
        self_outputs = self_info['outputs']
        for connection in self_outputs:
            if connection['name'] == "Data":
                end_name = connection['end_name']
                data = x
                traverse(connection['connects_to'], {end_name: TensorData(data)})
                break

        x = end_unit_output
        self.enable_send_data = False
        return x

    def execute(self, input_data: dict) -> dict:
        """
        This method is unnecessary for this unit.
        """
        raise AssertionError('This method should not be called.')

    def __repr__(self):
        return nn.Module.__repr__(self)
