"""
This file contains the HuggingfaceDatasetColumnData class, 
which is a data object that represents a column in a Huggingface dataset.
"""

from typing import List
from ..data import DataObject

class HuggingfaceDatasetColumnData(DataObject):
    """
    The HuggingfaceDatasetColumnData class represents a column in a Huggingface dataset.
    """
    
    def __init__(self, column_name: str, column_data: List, column_data_type: str):
        """
        Initialize the HuggingfaceDatasetColumnData object.

        Args:
            column_name (str): The name of the column.
            column_data (List): The data in the column.
        """
        self.column_name = column_name
        self.column_data = column_data
        self.column_data_type = column_data_type
        self.size = len(column_data)

    def to_json_dict(self):
        """
        Convert the dataset data to a JSON dictionary.
        """
        data = {}
        data['column_name'] = self.column_name
        data['column_data_type'] = self.column_data_type
        data['size'] = self.size
        return data
    
    def get_data(self):
        """
        Get the data from the dataset data object.
        """
        return self.column_data

    def __repr__(self):
        return f'HuggingfaceDatasetColumnData(column_name={self.column_name})'