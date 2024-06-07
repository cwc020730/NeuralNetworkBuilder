"""
This module contains the Conv2DUnit class, which is a subclass of the ModelLayerUnit class.
"""

import torch.nn as nn
from ..model_layer_unit import ModelLayerUnit
from ...data_objects import TensorData, VisualizableTensorData

class Conv2DUnit(ModelLayerUnit):
    """
    The Conv2DUnit class is a subclass of the ModelLayerUnit class.

    Args:
        unit_id (str): The ID of the unit.
        unit_info (dict): The information of the unit.

    Attributes:
        unit_id (str): The ID of the unit.
        unit_info (dict): The information of the unit.
    """
    def __init__(self, unit_id: str, unit_info: dict):
        super().__init__(unit_id, unit_info)
        self.conv2d = nn.Conv2d(
            in_channels=int(unit_info['parameters']['in_channels']['value']),
            out_channels=int(unit_info['parameters']['out_channels']['value']),
            kernel_size=int(unit_info['parameters']['kernel_size']['value']),
            stride=int(unit_info['parameters']['stride']['value']),
            padding=int(unit_info['parameters']['padding']['value']),
            bias=bool(unit_info['parameters']['bias']['value'])
        )

    def forward(self, input_data):
        """
        Forward pass of the convolutional layer.

        Args:
            input_data (dict): The input data.

        Returns:
            torch.Tensor: The output data.
        """
        input_data_tensor = input_data['Input'].get_data()
        output_tensor = self.conv2d(input_data_tensor)
        weight_tensor = self.conv2d.weight
        bias_tensor = self.conv2d.bias
        return {
            "weight": VisualizableTensorData(weight_tensor),
            "bias": TensorData(bias_tensor),
            "Output": VisualizableTensorData(output_tensor)
        }