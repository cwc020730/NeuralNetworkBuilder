"""
This file contains the ToDataloaderUnit class, which is responsible for converting the input data
"""

import torch.utils.data as data

from ...app import send_header_status_data
from ..data_processing_unit import DataProcessingUnit

class ToDataloaderUnit(DataProcessingUnit):
    """
    The ToDataloaderUnit class is a subclass of the DataProcessingUnit class.

    Args:
        unit_id (str): The ID of the unit.
        unit_info (dict): The information of the unit.
        all_units_data (dict): The data of all the units.

    Attributes:
        unit_id (str): The ID of the unit.
        unit_info (dict): The information of the unit.
        all_units_data (dict): The data of all the units.
    """
    def __init__(self, unit_id: str, unit_info: dict):
        super().__init__(unit_id, unit_info)
        self.batch_size = int(unit_info['parameters']['batch_size']['value'])
        self.shuffle = bool(unit_info['parameters']['shuffle']['value'])

    def execute(self, input_data):
        """
        Convert the input data to a PyTorch DataLoader.

        Args:
            input_data (dict): The input data to be converted.

        Returns:
            dict: The converted data.
        """
        send_header_status_data("Building DataLoader...")
        features_tensor, labels_tensor = input_data['Features'].get_data(), input_data['Labels'].get_data()
        dataloader = data.DataLoader(
            data.TensorDataset(features_tensor, labels_tensor),
            batch_size=self.batch_size,
            shuffle=self.shuffle
        )
        return {'dataloader': dataloader}