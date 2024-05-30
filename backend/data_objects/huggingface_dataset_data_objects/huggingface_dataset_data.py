"""
The huggingface_dataset_data module contains the HuggingFaceDatasetData class.
"""

from datasets import Dataset, DatasetDict
from ..dataset_data import DatasetData

class HuggingFaceDatasetData(DatasetData):
    """
    The HuggingFaceDatasetData class represents a dataset from Hugging Face.
    """
    
    def __init__(self, dataset, split):
        """
        Initialize the HuggingFaceDatasetData object.

        Args:
            dataset (Dataset or DatasetDict): The Hugging Face dataset.
            split (str): The split of the dataset.
        """
        if isinstance(dataset, DatasetDict):
            dataset = dataset[split]

        self.split = split

        super().__init__(dataset)

    def to_json_dict(self):
        """
        Convert the Hugging Face dataset data to a JSON dictionary.
        """
        pass

    def __repr__(self):
        return f'HuggingFaceDatasetData(split={self.split})'