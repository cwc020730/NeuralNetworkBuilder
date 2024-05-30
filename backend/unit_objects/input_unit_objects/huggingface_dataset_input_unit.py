"""
This file contains the HuggingFaceDatasetInputUnit class, which is a subclass of the InputUnit class.
"""

from datasets import load_dataset
from ..input_unit import InputUnit
from ...data_objects.huggingface_dataset_data_objects.huggingface_dataset_data import HuggingFaceDatasetData

class HuggingFaceDatasetInputUnit(InputUnit):
    """
    The HuggingFaceDatasetInputUnit class is a subclass of the InputUnit class and represents
    an input unit that loads a dataset from Hugging Face.

    Args:
        unit_id (str): The unique identifier for the unit.
        unit_info (dict): A dictionary containing information about the unit.
        dataset_name (str): The name of the dataset to load from Hugging Face.
        feature_columns (list): The list of feature columns to use.
        label_column (str, optional): The label column. Defaults to None.
    """
    def __init__(self, unit_id, unit_info, dataset_name, feature_columns, label_column=None):
        super().__init__(unit_id, unit_info)
        self.dataset_name = dataset_name
        self.feature_columns = feature_columns
        self.label_column = label_column

    def execute(self):
        """
        This method is used to execute the unit operation.
        
        Returns:
            dict: A dictionary containing the HuggingFaceDatasetData object.
        """
        # Load the dataset from Hugging Face
        dataset = load_dataset(self.dataset_name)
        
        # Create a HuggingFaceDatasetData object
        hf_dataset_data = HuggingFaceDatasetData(dataset, feature_columns=self.feature_columns, label_column=self.label_column)
        
        return {
            "HuggingFace Dataset": hf_dataset_data
        }

    def __repr__(self):
        return f'HuggingFaceDatasetInputUnit({self.id}, dataset_name={self.dataset_name})'
