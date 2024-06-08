"""
This object is a child of the TensorData object and is used to store data that can be visualized.
"""

import torch
from ..tensor_data import TensorData

class VisualizableTensorData(TensorData):
    """
    The VisualizableTensorData class is a child of the TensorData object and is used to store data that can be visualized.
    """

    def __init__(self, tensor: torch.Tensor):
        """
        Initialize the VisualizableTensorData object.

        Args:

        """
        super().__init__(tensor)
        assert self.tensor.ndim >= 2, "The tensor must have at least 2 dimensions."
        self.w, self.h = self.tensor.shape[-2], self.tensor.shape[-1]
        self.c = 1 if self.tensor.ndim == 2 else self.tensor.shape[-3]
        self.b = 1 if self.tensor.ndim == 2 else self.tensor.shape[0]

    def sample(self, n: int, batch: int = 1, channel: int = -1):
        """
        Sample n images from the tensor.

        Args:
            n (int): The number of images to sample.
            batch (int): The batch to sample. If -1, sample from channel.
            channel (int): The channel to sample. If -1, sample from batch.
        Returns:
            torch.Tensor: The sampled images.
        """
        # single image
        if self.tensor.ndim == 2:
            return self.tensor, 1
        # sample from channel
        if batch == -1:
            if channel == -1:
                raise ValueError("Either batch or channel must be specified.")
            if n > self.b:
                n = self.b
            return self.tensor[:n, channel, :], n
        # sample from batch
        if channel == -1:
            if n > self.c:
                n = self.c
            return self.tensor[batch, :n, :], n
        # sample from batch and channel
        return self.tensor[batch, channel, :], 1
