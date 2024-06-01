"""
This file contains the parent class for all the optimizer units.
"""

from .unit import Unit

class OptimizerUnit(Unit):
    """
    The OptimizerUnit class is a subclass of the Unit class.

    Args:
        unit_id (str): The ID of the unit.
        unit_info (dict): The information of the unit.

    Attributes:
        unit_id (str): The ID of the unit.
        unit_info (dict): The information of the unit.
    """
    def __init__(self, unit_id: str, unit_info: dict):
        super().__init__(unit_id, unit_info)
        self.optimizer = None

    def execute(self, input_data):
        raise AssertionError('Execute method should not be called for OptimizerUnit')

    def get_optimizer(self):
        """
        Get the optimizer.

        Returns:
            torch.optim.Optimizer: The optimizer.
        """
        return self.optimizer