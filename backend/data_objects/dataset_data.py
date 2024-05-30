"""
The dataset_data module contains the DatasetData class.
"""

from .data import DataObject

class DatasetData(DataObject):
    """
    The DatasetData class serves as a base class for different types of datasets.
    """

    def __init__(self, dataset):
        """
        Initialize the DatasetData object.

        Args:
            dataset (Dataset or DatasetDict): The dataset.
        """
        self.dataset = dataset

    def to_json_dict(self):
        """
        Convert the dataset data to a JSON dictionary.
        """
        raise NotImplementedError

    def __repr__(self):
        return 'DatasetData()'