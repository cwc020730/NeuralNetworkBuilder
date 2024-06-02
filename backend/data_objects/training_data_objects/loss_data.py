"""
This file contains the LossData class, which is used to store the loss data for a model.
"""

from ..training_data import TrainingData

class LossData(TrainingData):
    """
    The LossData class is a subclass of the TrainingData class.
    It is used to store the loss data for a model.

    Args:
        loss_list (list): The list of losses of the model.
    """
    def __init__(self, loss_list: list):
        super().__init__()
        self.loss_list = loss_list

    def to_json_dict(self):
        """
        Convert the loss data object to a JSON dictionary.

        Returns:
            dict: The JSON dictionary representation of the loss data object.
        """
        return {
            'type': 'loss',
            'loss_by_epoch': self.loss_list,
            'final_loss': self.loss_list[-1] if len(self.loss_list) > 0 else 'N/A'
        }

    def get_data(self):
        """
        Get the loss from the loss data object.

        Returns:
            float: The loss of the model.
        """
        return self.loss_list
    
    def add_loss(self, loss: float):
        """
        Add a loss to the loss list.

        Args:
            loss (float): The loss to add.
        """
        self.loss_list.append(loss)

    def __repr__(self):
        return f'LossData(loss={self.loss_list})'