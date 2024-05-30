"""
This module contains the IntegerToOneHotUnit object, 
which is a subclass of the Unit object.
"""

from typing import List
import torch
from ...data_objects.tensor_data import TensorData
from ..data_processing_unit import DataProcessingUnit
from ...data_objects.data import DataObject

class IntegerToOneHotUnit(DataProcessingUnit):
    """
    The IntegerToOneHotUnit class is a subclass of the Data

    Args:
        unit_id (str): The unique identifier for the unit.
        unit_info (dict): A dictionary containing information about the unit.
    """
    def __init__(self, unit_id: str, unit_info: dict):
        super().__init__(unit_id, unit_info)

    def execute(self, input_data_raw: List[DataObject]) -> torch.Tensor:
        """
        This method is used to execute the unit operation.

        Args:
            input_data: A list of integers.

        Returns:
            torch.Tensor: A tensor containing the one-hot encoded vectors.
        """
        input_data = input_data_raw[0].get_data()
        onehot = torch.nn.functional.one_hot(torch.tensor(input_data))
        onehot = onehot.to(torch.float32)
        return {
            "One-hot tensor": TensorData(onehot)
        }

    def __repr__(self):
        return f'IntegerToOneHotUnit({self.id})'