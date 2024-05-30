"""
The huggingface_dataset_data module contains the HuggingFaceDatasetData class.
"""

from datasets import Dataset, DatasetDict
from ..dataset_data import DatasetData

class HuggingFaceDatasetData(DatasetData):
    """
    The HuggingFaceDatasetData class represents a dataset from Hugging Face.
    """
    
    def __init__(self, dataset, split, feature_columns, label_column=None):
        """
        Initialize the HuggingFaceDatasetData object.

        Args:
            dataset (Dataset or DatasetDict): The Hugging Face dataset.
            feature_columns (list): The list of feature columns to use.
            label_column (str, optional): The label column. Defaults to None.
        """
        if isinstance(dataset, DatasetDict):
            dataset = dataset[split]

        data = dataset[feature_columns]
        labels = dataset[label_column] if label_column else None

        super().__init__(data, labels)
        self.feature_columns = feature_columns
        self.label_column = label_column
        self.dataset = dataset

    def to_json_dict(self):
        """
        Convert the Hugging Face dataset data to a JSON dictionary.

        Returns:
            dict: A JSON dictionary.
        """
        data_dict = super().to_json_dict()
        data_dict.update({
            "feature_columns": self.feature_columns,
            "label_column": self.label_column
        })
        return data_dict

    def __repr__(self):
        return f'HuggingFaceDatasetData(size={self.size}, feature_columns={self.feature_columns}, label_column={self.label_column})'