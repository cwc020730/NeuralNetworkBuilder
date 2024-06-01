"""
This file contains the ReLU unit object class.
"""

import torch.nn as nn
from ..model_layer_unit import ModelLayerUnit
from ...data_objects import TensorData

class ReLUUnit(ModelLayerUnit):
    """
    The ReLUUnit class represents a ReLU unit object.

    Args:
        unit_id (str): The ID of the unit.
        unit_info (dict): The information of the unit.

    Attributes:
        unit_id (str): The ID of the unit.
        unit_info (dict): The information of the unit.
    """
    def __init__(self, unit_id: str, unit_info: dict):
        super().__init__(unit_id, unit_info)
        self.layer = nn.ReLU()

    def forward(self, input_data):
        """
        Forward pass.

        Args:
            x (torch.Tensor): The input tensor.

        Returns:
            torch.Tensor: The output tensor.
        """
        input_data_tensor = input_data["Input"].get_data()
        return {
            "Output": TensorData(self.layer(input_data_tensor))
        }