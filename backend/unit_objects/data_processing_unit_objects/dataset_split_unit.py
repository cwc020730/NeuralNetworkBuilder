"""
This module contains the DatasetSplitUnit class, which is responsible for 
splitting the dataset into features and labels.
"""

from typing import overload
from ..data_processing_unit import DataProcessingUnit
from ...data_objects.huggingface_dataset_data_objects.huggingface_dataset_column_data import HuggingfaceDatasetColumnData
from ...data_objects.huggingface_dataset_data_objects.image.huggingface_image_classification_dataset_data import HuggingfaceImageClassificationDatasetData

class DatasetSplitUnit(DataProcessingUnit):
    """
    The DatasetSplitUnit class is a subclass of the DataProcessingUnit class and represents
    a unit that splits a dataset into features and labels.

    Args:
        unit_id (str): The unique identifier for the unit.
        unit_info (dict): A dictionary containing information about the unit.
    """
    def __init__(self, unit_id, unit_info):
        super().__init__(unit_id, unit_info)

    def execute(self, input_data):
        """
        This method is used to execute the unit operation.

        Args:
            input_data (list): A list containing the input data.

        Returns:
            dict: A dictionary containing the output data.
        """
        dataset = input_data[0]
        if isinstance(dataset, HuggingfaceImageClassificationDatasetData):
            return {
                "Features": HuggingfaceDatasetColumnData(dataset.image_column, dataset.images, dataset.image_type),
                "Labels": HuggingfaceDatasetColumnData(dataset.label_column, dataset.labels, dataset.label_type)
            }

    def __repr__(self):
        return f'DatasetSplitUnit({self.id})'