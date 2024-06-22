"""
This unit object is responsible for normalizing a tensor data.
"""

import torch
from ..data_processing_unit import DataProcessingUnit

class NormalizeUnit(DataProcessingUnit):
    """
    The NormalizeUnit class is responsible for normalizing a tensor data.
    """

    def __init__(self, unit_id: str, unit_info: dict):
        """
        Initializes a new NormalizeUnit object.

        Args:
            unit_id (str): The unique identifier for the unit.
            unit_info (dict): A dictionary containing information about the unit.
        """
        super().__init__(unit_id, unit_info)

    def execute(self, input_data) -> dict:
        """
        Normalize the input data.

        Args:
            input_data: The input data to be normalized.

        Returns:
            dict: The normalized data.
        """
        input_data_obj = input_data["Data"]
        input_data_obj_class = input_data_obj.__class__
        input_data_obj.calc_stats()
        mean = input_data_obj.mean
        std = input_data_obj.std
        normalized_tensor = (input_data_obj.get_data() - mean) / std
        return {
            "Normalized data": input_data_obj_class(normalized_tensor)
        }