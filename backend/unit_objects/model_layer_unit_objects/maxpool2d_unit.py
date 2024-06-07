"""
This module contains the MaxPool2DUnit class, which is a subclass of the ModelLayerUnit class.
"""

import torch.nn as nn
from ..model_layer_unit import ModelLayerUnit
from ...data_objects import VisualizableTensorData

class MaxPool2DUnit(ModelLayerUnit):
    """
    The MaxPool2DUnit class is a subclass of the ModelLayerUnit class.

    Args:
        unit_id (str): The ID of the unit.
        unit_info (dict): The information of the unit.

    Attributes:
        unit_id (str): The ID of the unit.
        unit_info (dict): The information of the unit.
    """
    def __init__(self, unit_id: str, unit_info: dict):
        super().__init__(unit_id, unit_info)
        self.maxpool2d = nn.MaxPool2d(
            kernel_size=int(unit_info['parameters']['kernel_size']['value']),
            stride=int(unit_info['parameters']['stride']['value']),
            padding=int(unit_info['parameters']['padding']['value'])
        )

    def forward(self, input_data):
        """
        Forward pass of the max pooling layer.

        Args:
            input_data (dict): The input data.

        Returns:
            torch.Tensor: The output data.
        """
        input_data_tensor = input_data['Input'].get_data()
        output_tensor = self.maxpool2d(input_data_tensor)
        return {
            "Output": VisualizableTensorData(output_tensor)
        }