"""
This module contains the FlattenUnit class, which is a subclass of the ModelLayerUnit class.
"""

import torch.nn as nn
from ..model_layer_unit import ModelLayerUnit
from ...data_objects import TensorData

class FlattenUnit(ModelLayerUnit):
    """
    The FlattenUnit class is a subclass of the ModelLayerUnit class.

    Args:
        unit_id (str): The ID of the unit.
        unit_info (dict): The information of the unit.

    Attributes:
        unit_id (str): The ID of the unit.
        unit_info (dict): The information of the unit.
    """
    def __init__(self, unit_id: str, unit_info: dict):
        super().__init__(unit_id, unit_info)
        self.flatten = nn.Flatten()

    def forward(self, input_data):
        """
        Forward pass of the flatten layer.

        Args:
            input_data (dict): The input data.

        Returns:
            torch.Tensor: The output data.
        """
        input_data_tensor = input_data['Input'].get_data()
        return {
            "Output": TensorData(self.flatten(input_data_tensor))
        }