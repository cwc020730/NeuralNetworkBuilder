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
        self.min = None
        self.max = None
        self.mean = None
        self.std = None
        self.shape = None

    def calc_stats(self):
        """
        Calculate the min, max, mean, and standard deviation of the tensor data.
        """
        if self.tensor.dtype == torch.float32:
            self.min = self.tensor.min().item() if self.tensor.numel() > 0 else None
            self.max = self.tensor.max().item() if self.tensor.numel() > 0 else None
            self.mean = self.tensor.mean().item() if self.tensor.numel() > 0 else None
            self.std = self.tensor.std().item() if self.tensor.numel() > 0 else None
            self.shape = list(self.tensor.shape)
        elif self.tensor.dtype == torch.long:
            self.min = self.tensor.min().item() if self.tensor.numel() > 0 else None
            self.max = self.tensor.max().item() if self.tensor.numel() > 0 else None
            self.mean = None
            self.std = None
            self.shape = list(self.tensor.shape)

    def _reduce_dimension(self, tensor: torch.Tensor):
        """
        Reduce the size of the largest dimension of the tensor for JSON serialization.

        Args:
            tensor (torch.Tensor): The tensor to reduce.

        Returns:
            torch.Tensor: The reduced tensor.
        """
        # if the total number of elements in the tensor does not exceed 100000,
        # return the tensor as is
        multiplier = 1
        for dim in tensor.shape:
            multiplier *= dim
        if multiplier <= 100000:
            return tensor

        new_shape = list(tensor.shape)
        for i, dim in enumerate(tensor.shape):
            # iteratively reduce the leftmost dimension by half until the total
            # number of elements is less than 100000
            while new_shape[i] > 1:
                new_shape[i] //= 2
                multiplier //= 2
                if multiplier <= 100000:
                    break
            if multiplier <= 100000:
                break

        slices = tuple(slice(0, dim) for dim in new_shape)
        new_tensor = tensor[slices]

        return new_tensor

    def to_json_dict(self):
        """
        Convert the data to a JSON string.
    
        Returns:
            str: A JSON string.
        """
        reduced_tensor = self._reduce_dimension(self.tensor)  # Get a reduced view of the tensor
        self.calc_stats()
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
