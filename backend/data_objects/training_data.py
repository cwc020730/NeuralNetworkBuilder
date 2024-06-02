"""
The parent class for all the training data objects in the application.
"""

from .data import DataObject

class TrainingData(DataObject):
    """
    The TrainingData class is the parent class for all the training data objects in the application.
    """
    
    def __init__(self):
        super().__init__()

    def to_json_dict(self):
        """
        Convert the training data object to a JSON dictionary.
        """
        raise NotImplementedError

    def get_data(self):
        """
        Get the data from the training data object.
        """
        raise NotImplementedError

    def __repr__(self):
        raise NotImplementedError