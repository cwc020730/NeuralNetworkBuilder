"""
This file contains the HuggingFaceDatasetInputUnit class, which is a subclass of the InputUnit class.
"""

from datasets import load_dataset, load_dataset_builder
from ..input_unit import InputUnit
from ...data_objects.huggingface_dataset_data_objects.image.huggingface_image_classification_dataset_data import HuggingfaceImageClassificationDatasetData

class HuggingFaceDatasetInputUnit(InputUnit):
    """
    The HuggingFaceDatasetInputUnit class is a subclass of the InputUnit class and represents
    an input unit that loads a dataset from Hugging Face.

    Args:
        unit_id (str): The unique identifier for the unit.
        unit_info (dict): A dictionary containing information about the unit.
        dataset_name (str): The name of the dataset to load from Hugging Face.
        feature_columns (list, optional): The list of feature columns to use. If None, all non-label columns will be used.
        label_column (str, optional): The label column. Defaults to None. If None, it tries to auto-detect the label column.
    """
    def __init__(self, unit_id, unit_info):
        super().__init__(unit_id, unit_info)
        self.dataset_name = unit_info['parameters']['dataset']['value']
        self.split = unit_info['parameters']['split']['value']
        self.task = 'auto'

    def get_dataset_tasks(self):
        """
        Get the task type of a dataset from Hugging Face.

        Returns:
            str: The task type of the dataset.
        """
        builder = load_dataset_builder(self.dataset_name)
        return builder.info.task_templates

    def execute(self, input_data):
        """
        This method is used to execute the unit operation.

        Returns:
            dict: A dictionary containing the HuggingFaceDatasetData object.
        """
        dataset = load_dataset(self.dataset_name)
        
        tasks = self.get_dataset_tasks()
        if self.task == 'auto':
            selected_task = tasks[0]
        else:
            for task in tasks:
                if task.task == self.task:
                    selected_task = task
                    break

        if selected_task.task == 'image-classification':
            return {
                "Dataset": HuggingfaceImageClassificationDatasetData(dataset, self.split, selected_task.image_column, selected_task.label_column)
            }

    def __repr__(self):
        return f'HuggingFaceDatasetInputUnit({self.id}, dataset_name={self.dataset_name})'

