"""
This file contains the RandomInputUnit class, which is a subclass of the InputUnit class.
"""
import torch
from ..input_unit import InputUnit
from ...data_objects.tensor_data import TensorData

class RandomInputUnit(InputUnit):
    """
    The RandomInputUnit class is a subclass of the InputUnit class and represents a 
    random input unit on the canvas.

    Args:
        unit_id (str): The unique identifier for the unit.
        unit_info (dict): A dictionary containing information about the unit.
    """
    def __init__(self, unit_id, unit_info, input_shape):
        super().__init__(unit_id, unit_info)
        # remove zeros from input_shape
        self.input_shape = [x for x in input_shape if x != 0]
        if len(self.input_shape) == 0:
            self.input_shape = [0]

    def execute(self):
        """
        This method is used to execute the unit operation.
        """
        
        return {
            "Random Input": TensorData(torch.rand(self.input_shape))
        }

    def __repr__(self):
        return f'RandomInputUnit({self.id})'