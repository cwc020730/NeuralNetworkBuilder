"""
This module contains the model layer for the unit objects.
"""

import torch.nn as nn
from .unit import Unit

class ModelLayerUnit(Unit, nn.Module):
    """
    The ModelLayerUnit class is a subclass of the Unit and nn.Module classes.

    Args:
        unit_id (str): The ID of the unit.
        unit_info (dict): The information of the unit.

    Attributes:
        unit_id (str): The ID of the unit.
        unit_info (dict): The information of the unit.
    """
    def __init__(self, unit_id: str, unit_info: dict):
        Unit.__init__(self, unit_id, unit_info)
        nn.Module.__init__(self)

    def forward(self, input_data):
        """
        Forward pass of the model layer.

        Args:
            input_data (torch.Tensor): The input data.

        Returns:
            torch.Tensor: The output data.
        """
        raise NotImplementedError('Forward method must be implemented for ModelLayerUnit')
    
    def execute(self, input_data):
        raise AssertionError('ModelLayerUnit should not be executed directly')