"""
The dataset_data module contains the DatasetData class.
"""

import torch

class DatasetData:
    """
    The DatasetData class serves as a base class for different types of datasets.
    """

    def __init__(self, data, labels=None):
        """
        Initialize the DatasetData object.

        Args:
            data (torch.Tensor or list): The dataset data.
            labels (torch.Tensor or list, optional): The dataset labels. Defaults to None.
        """
        self.data = data
        self.labels = labels
        self.size = len(data)
        self.feature_dim = data[0].shape if isinstance(data, torch.Tensor) else None

    def to_json_dict(self):
        """
        Convert the dataset data to a JSON dictionary.

        Returns:
            dict: A JSON dictionary.
        """
        data_dict = {
            "type": "Dataset",
            "data": self.data.tolist() if isinstance(self.data, torch.Tensor) else self.data,
            "labels": self.labels.tolist() if isinstance(self.labels, torch.Tensor) else self.labels,
            "size": self.size,
            "feature_dim": self.feature_dim
        }
        return data_dict

    def __repr__(self):
        return f'DatasetData(size={self.size}, feature_dim={self.feature_dim})'