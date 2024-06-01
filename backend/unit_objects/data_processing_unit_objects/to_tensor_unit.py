"""
This file contains the implementation of the ToTensorUnit class.
"""

import torch
import numpy as np
from PIL.Image import Image as PILImage
from torchvision.transforms import transforms
from ..data_processing_unit import DataProcessingUnit
from ...data_objects import TensorData

class ToTensorUnit(DataProcessingUnit):
    """
    The ToTensorUnit class is responsible for converting data to tensors.
    """

    def __init__(self, unit_id: str, unit_info: dict):
        """
        Initializes a new ToTensorUnit object.

        Args:
            unit_id (str): The unique identifier for the unit.
            unit_info (dict): A dictionary containing information about the unit.
        """
        super().__init__(unit_id, unit_info)

    def execute(self, input_data) -> dict:
        """
        Converts the input data to a tensor.

        Args:
            input_data: The input data to be converted to a tensor.

        Returns:
            torch.Tensor: The input data converted to a tensor.
        """
        transform = transforms.ToTensor()
        input_data = input_data["Input data"].get_data()
        if isinstance(input_data, list):
            # Check if all elements are PIL images
            if all(isinstance(data, PILImage) for data in input_data):
                list_of_tensor = [transform(data) for data in input_data]
                tensor = torch.stack(list_of_tensor)
                return {
                    "Tensor": TensorData(tensor)
                }
            # Check if all elements are integers
            elif all(isinstance(data, int) for data in input_data):
                return {
                    "Tensor": TensorData(torch.tensor(input_data, dtype=torch.int32))
                }
        elif isinstance(input_data, (PILImage, np.ndarray)):
            return {
                "Tensor": TensorData(transform(input_data))
            }
        else:
            raise ValueError(f"Invalid input data type: {type(input_data)}")
    
    def __repr__(self):
        return f"ToTensorUnit(unit_id: {self.id})"