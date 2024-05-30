"""
This file contains the HuggingfaceImageClassificationDatasetData class, 
which is a data object class that represents a Huggingface image classification dataset.
"""

from ..huggingface_dataset_data import HuggingFaceDatasetData

class HuggingfaceImageClassificationDatasetData(HuggingFaceDatasetData):
    """
    The HuggingfaceImageClassificationDatasetData class represents a Huggingface image classification dataset.
    """
    
    def __init__(self, dataset, split, feature_columns, label_column=None):
        """
        Initialize the HuggingfaceImageClassificationDatasetData object.

        Args:
            dataset (Dataset or DatasetDict): The Hugging Face dataset.
            feature_columns (list): The list of feature columns to use.
            label_column (str, optional): The label column. Defaults to None.
        """
        super().__init__(dataset, split, feature_columns, label_column)

    def __repr__(self):
        return f'HuggingfaceImageClassificationDatasetData(size={self.size}, feature_columns={self.feature_columns}, label_column={self.label_column})'