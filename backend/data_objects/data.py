"""
The parent class for all data objects in the application.
"""

class DataObject:
    """
    The DataObject class is the parent class for all data objects in the application.
    """
    
    def __init__(self):
        pass

    def to_json_dict(self):
        """
        Convert the data object to a JSON dictionary.
        """
        raise NotImplementedError

    def __repr__(self):
        raise NotImplementedError