"""
This file contains the class definition for the AccuracyData object. 
This object is used to store the accuracy of a model
"""

from ..training_data import TrainingData

class AccuracyData(TrainingData):
    """
    The AccuracyData class is a subclass of the TrainingData class.
    It is used to store the accuracy of a model.

    Args:
        accuracy_list (list): The list of accuracies of the model.
    """
    def __init__(self, accuracy_list: list):
        super().__init__()
        self.accuracy_list = accuracy_list

    def to_json_dict(self):
        """
        Convert the accuracy data object to a JSON dictionary.

        Returns:
            dict: The JSON dictionary representation of the accuracy data object.
        """
        return {
            'type': 'accuracy',
            'accuracy_by_epoch': self.accuracy_list,
            'final_accuracy': self.accuracy_list[-1] if len(self.accuracy_list) > 0 else 'N/A',
            'final_accuracy_percentage': f'{round(self.accuracy_list[-1] * 100, 2)}%' if len(self.accuracy_list) > 0 else 'N/A'
        }

    def get_data(self):
        """
        Get the accuracy from the accuracy data object.

        Returns:
            float: The accuracy of the model.
        """
        return self.accuracy_list
    
    def add_accuracy(self, accuracy: float):
        """
        Add an accuracy to the accuracy list.

        Args:
            accuracy (float): The accuracy to add.
        """
        self.accuracy_list.append(accuracy)

    def __repr__(self):
        return f'AccuracyData(accuracy={self.accuracy_list})'