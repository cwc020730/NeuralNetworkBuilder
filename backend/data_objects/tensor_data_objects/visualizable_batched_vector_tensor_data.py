"""
This file contains the VisualizableBatchedVectorTensorData class, 
which is a subclass of the TensorData class.
"""

from ..tensor_data import TensorData

class VisualizableBatchedVectorTensorData(TensorData):
    """
    The VisualizableBatchedVectorTensorData class is a subclass of the TensorData class.
    It is used to store tensor in the shape (batch_size, feature_vector_size) that can be visualized.
    """

    def __init__(self, tensor):
        """
        Initialize the VisualizableBatchedVectorTensorData object.

        Args:
            tensor (torch.Tensor): The tensor data.
        """
        super().__init__(tensor)
        assert self.tensor.ndim == 2, "The tensor must have 2 dimensions."

    def sample(self, n: int, batch: int = -1):
        """
        Sample n vectors from the tensor.

        Args:
            n (int): The number of vectors to sample. If -1, sample all vectors.
            batch (int): The batch to sample. If -1, sample from all batches.

        Returns:
            torch.Tensor: The sampled vectors.
        """
        if batch == -1:
            if n > self.tensor.shape[0] or n == -1:
                n = self.tensor.shape[0]
            return self.tensor[:n, :], n
        if n > self.tensor.shape[1] or n == -1:
            n = self.tensor.shape[1]
        return self.tensor[batch, :n], n