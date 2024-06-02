"""
This file contains the loss function unit object, 
which is a parent class for all the loss function unit objects.
"""

from .unit import Unit

class LossFuncUnit(Unit):
    """
    The LossFuncUnit class is a subclass of the Unit class.

    Args:
        unit_id (str): The ID of the unit.
        unit_info (dict): The information of the unit.
    """
    def __init__(self, unit_id: str, unit_info: dict):
        super().__init__(unit_id, unit_info)
        self.loss_func = None

    def execute(self, input_data):
        raise AssertionError('Execute method should not be called for LossFuncUnit')

    def get_loss_func(self):
        """
        Get the loss function.

        Returns:
            torch.nn.Module: The loss function.
        """
        return self.loss_func
    
    def get_accuracy(self, actual, expected):
        """
        Get the accuracy of the model.

        Args:
            actual (torch.Tensor): The actual output.
            expected (torch.Tensor): The expected output.

        Returns:
            float: The accuracy of the model.
        """
        raise NotImplementedError('This method should be implemented by the subclass')