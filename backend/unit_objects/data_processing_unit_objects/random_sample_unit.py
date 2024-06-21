"""
This module contains the RandomSampleUnit class, 
which is a subclass of the DataProcessingUnit class.
"""
import random
from ..data_processing_unit import DataProcessingUnit
from ...data_objects import HuggingfaceDatasetColumnData

class RandomSampleUnit(DataProcessingUnit):
    """
    The RandomSampleUnit class is a subclass of the DataProcessingUnit class.

    Args:
        unit_id (str): The ID of the unit.
        unit_info (dict): The information of the unit.
        all_units_data (dict): The data of all the units.

    Attributes:
        unit_id (str): The ID of the unit.
        unit_info (dict): The information of the unit.
    """
    def __init__(self, unit_id: str, unit_info: dict):
        super().__init__(unit_id, unit_info)

    def execute(self, input_data: dict):
        """
        Process the data.

        Args:
            input_data (dict): The input data dictionary.

        Returns:
            dict: The output data dictionary.
        """
        input_data = input_data["Data"]
        if isinstance(input_data, HuggingfaceDatasetColumnData):
            column_data = input_data.get_data()
            column_data_size = input_data.size
            sample_size = self.unit_parameters['size']['value']
            if sample_size > column_data_size:
                raise ValueError("Sample size is larger than the column data size.")
            random_sample = random.sample(column_data, sample_size)
            return {
                "Sampled data": HuggingfaceDatasetColumnData(input_data.column_name, random_sample, input_data.column_data_type)
            }
        else:
            raise ValueError(f"Input data type {type(input_data)} not supported.")
