"""
This file contains the EmptyData class, which is used to represent an empty data object.
"""

from .data import DataObject

class EmptyData(DataObject):
    """
    The EmptyData class is a subclass of the Data
    Object class and represents an empty data object.
    """
    
    def __init__(self):
        pass

    def to_json_dict(self):
        """
        Convert the data object to a JSON dictionary.
        """
        return {}
    
    def get_data(self):
        """
        Get the data from the data object.
        """
        return None

    def __repr__(self):
        return 'EmptyData()'