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

    def _reduce_dimension(self, tensor: torch.Tensor, max_size=1000):
        """
        Reduce the size of the largest dimension of the tensor for JSON serialization.

        Args:
            tensor (torch.Tensor): The tensor to reduce.
            max_size (int): The maximum size for the largest dimension.

        Returns:
            torch.Tensor: The reduced tensor.
        """
        # if the total number of elements in the tensor does not exceed 100000, return the tensor as is
        multiplier = 1
        for dim in tensor.shape:
            multiplier *= dim
        if multiplier <= 100000:
            return tensor
        # if not, reduce the size of the largest dimension to max_size
        if tensor.numel() > max_size:
            largest_dim = tensor.shape.index(max(tensor.shape))
            if tensor.shape[largest_dim] > max_size:
                indices = torch.cat((torch.arange(max_size // 2), torch.arange(tensor.shape[largest_dim] - max_size // 2, tensor.shape[largest_dim])))
                tensor = tensor.index_select(largest_dim, indices)
        return tensor

    def to_json_dict(self):
        """
        Convert the data to a JSON string.

        Returns:
            str: A JSON string.
        """
        reduced_tensor = self._reduce_dimension(self.tensor)  # Get a reduced view of the tensor
        data = {
            "type": "Tensor",
            "value": reduced_tensor.clone().tolist(),
            "min": self.min,
            "max": self.max,
            "mean": self.mean,
            "std": self.std,
            "shape": self.shape
        }
        return data
    
    def get_data(self):
        """
        Get the data from the data object.

        Returns:
            torch.Tensor: The tensor data.
        """
        return self.tensor

    def __repr__(self):
        return f'TensorData({self.tensor})'
