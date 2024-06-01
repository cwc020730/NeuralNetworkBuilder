"""
This module contains the LinearUnit class, which is a subclass of the Unit class.
"""

import torch.nn as nn
from ..model_layer_unit import ModelLayerUnit
from ...data_objects import TensorData

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
        self.in_features = int(unit_info['parameters']['in_features']['value'])
        self.out_features = int(unit_info['parameters']['out_features']['value'])
        self.bias = bool(unit_info['parameters']['bias']['value'])
        self.linear = nn.Linear(self.in_features, self.out_features, self.bias)

    def forward(self, input_data):
        """
        Forward pass of the linear layer.

        Args:
            input_data (dict): The input data.

        Returns:
            torch.Tensor: The output data.
        """
        input_data_tensor = input_data['Input'].get_data()
        return {
            "Output": TensorData(self.linear(input_data_tensor))
        }
