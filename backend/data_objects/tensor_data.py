"""
This file contains the class definition for the TensorData object.
"""

import torch
from .data import DataObject

class TensorData(DataObject):
    """
    The TensorData class represents a tensor data object.

    Args:
        tensor (torch.Tensor): The tensor data.

    Attributes:
        tensor (torch.Tensor): The tensor data.
    """
    def __init__(self, tensor: torch.Tensor):
        self.tensor = tensor
        self.min = tensor.min().item() if tensor.numel() > 0 else None
        self.max = tensor.max().item() if tensor.numel() > 0 else None
        self.mean = tensor.mean().item() if tensor.numel() > 0 else None
        self.std = tensor.std().item() if tensor.numel() > 0 else None
        self.shape = list(tensor.shape)

    def to_json_dict(self):
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
        return data

    def __repr__(self):
        return f'TensorData({self.tensor})'
