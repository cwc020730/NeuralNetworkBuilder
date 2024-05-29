"""
This file contains the class definition for the TensorData object.
"""

import torch
import json

class TensorData:
    """
    The TensorData class represents a tensor data object.

    Args:
        tensor (torch.Tensor): The tensor data.

    Attributes:
        tensor (torch.Tensor): The tensor data.
    """
    def __init__(self, tensor: torch.Tensor):
        self.tensor = tensor
        self.min = tensor.min().item()
        self.max = tensor.max().item()
        self.mean = tensor.mean().item()
        self.std = tensor.std().item()
        self.shape = tensor.shape

    def to_json(self):
        """
        Convert the data to a JSON string.

        Returns:
            str: A JSON string.
        """
        data = {
            "type": "Tensor",
            "value": self.tensor.clone().tolist(),
            "min": self.min,
            "max": self.max,
            "mean": self.mean,
            "std": self.std,
            "shape": self.shape
        }
        return json.dumps(data)

    def __repr__(self):
        return f'TensorData({self.tensor})'
