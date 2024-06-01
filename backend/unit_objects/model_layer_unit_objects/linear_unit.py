"""
This module contains the LinearUnit class, which is a subclass of the Unit class.
"""

import torch.nn as nn
from ..model_layer_unit import ModelLayerUnit

class LinearUnit(ModelLayerUnit):
    """
    The LinearUnit class is a subclass of the ModelLayerUnit class.

    Args:
        unit_id (str): The ID of the unit.
        unit_info (dict): The information of the unit.

    Attributes:
        unit_id (str): The ID of the unit.
        unit_info (dict): The information of the unit.
    """
    def __init__(self, unit_id: str, unit_info: dict):
        super().__init__(unit_id, unit_info)
        self.in_features = unit_info['parameters']['in_features']['value']
        self.out_features = unit_info['parameters']['out_features']['value']
        self.bias = unit_info['parameters']['bias']['value']
        self.linear = nn.Linear(self.in_features, self.out_features, self.bias)

    def forward(self, input_data):
        """
        Forward pass of the linear layer.

        Args:
            input_data (torch.Tensor): The input data.

        Returns:
            torch.Tensor: The output data.
        """
        return self.linear(input_data)