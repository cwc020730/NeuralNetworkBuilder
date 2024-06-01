"""
This file contains the class CrossEntropyLossUnit, which is a subclass of LossUnit
"""

import torch.nn as nn
from ..loss_func_unit import LossFuncUnit

class CrossEntropyLossUnit(LossFuncUnit):
    """
    The CrossEntropyLossUnit class is a subclass of the LossFuncUnit class.

    Args:
        unit_id (str): The ID of the unit.
        unit_info (dict): The information of the unit.

    Attributes:
        unit_id (str): The ID of the unit.
        unit_info (dict): The information of the unit.
    """
    def __init__(self, unit_id: str, unit_info: dict):
        super().__init__(unit_id, unit_info)
        self.loss_func = nn.CrossEntropyLoss()

    def get_loss_func(self):
        """
        Get the loss function.

        Returns:
            torch.nn.modules.loss._Loss: The loss function.
        """
        return self.loss_func