"""
This module contains the DatasetSplitUnit class, which is responsible for 
splitting the dataset into features and labels.
"""

from ..data_processing_unit import DataProcessingUnit

class DatasetSplitUnit(DataProcessingUnit):
    """
    The DatasetSplitUnit class is a subclass of the DataProcessingUnit class and represents
    a unit that splits a dataset into features and labels.

    Args:
        unit_id (str): The unique identifier for the unit.
        unit_info (dict): A dictionary containing information about the unit.
    """
    def __init__(self, unit_id, unit_info):
        super().__init__(unit_id, unit_info)

    def execute(self):
        """
        This method is used to execute the unit operation.

        Returns:
            dict: A dictionary containing the output data.
        """
        input_data = self.input_connections[0].source_node.data
        features = input_data['features']
        labels = input_data['labels']
        return {
            'Features': features,
            'Labels': labels
        }

    def __repr__(self):
        return f'DatasetSplitUnit({self.id})'