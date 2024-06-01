"""
This file contains the SGDUnit class, which is a subclass of the OptimizerUnit class. 
It implements the SGD optimizer.
"""

import torch.optim as optim
from ..optimizer_unit import OptimizerUnit

class SGDUnit(OptimizerUnit):
    """
    The SGDUnit class is a subclass of the OptimizerUnit class.

    Args:
        unit_id (str): The ID of the unit.
        unit_info (dict): The information of the unit.

    Attributes:
        unit_id (str): The ID of the unit.
        unit_info (dict): The information of the unit.
    """
    def __init__(self, unit_id: str, unit_info: dict):
        super().__init__(unit_id, unit_info)
        self.learning_rate = unit_info['parameters']['learning_rate']['value']
        self.momentum = unit_info['parameters']['momentum']['value']
        self.optimizer = optim.SGD

    def get_optimizer(self, model):
        """
        Get the optimizer.

        Returns:
            torch.optim.Optimizer: The optimizer.
        """
        return self.optimizer(model.parameters(), lr=self.learning_rate, momentum=self.momentum)