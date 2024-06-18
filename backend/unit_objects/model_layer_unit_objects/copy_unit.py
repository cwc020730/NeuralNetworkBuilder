"""
This module contains the copy_unit function, which is used to split a data
into two.
"""

from ..model_layer_unit import ModelLayerUnit

class CopyUnit(ModelLayerUnit):
    """
    The CopyUnit class is a subclass of the ModelLayerUnit class.

    Args:
        unit_id (str): The ID of the unit.
        unit_info (dict): The information of the unit.

    Attributes:
        unit_id (str): The ID of the unit.
        unit_info (dict): The information of the unit.
    """
    def __init__(self, unit_id: str, unit_info: dict):
        super().__init__(unit_id, unit_info)

    def forward(self, input_data):
        """
        Forward pass of the copy layer.

        Args:
            input_data (dict): The input data.

        Returns:
            dict: The output data.
        """
        input_class = input_data["Input"].__class__
        input_data_tensor = input_data["Input"].get_data()
        return {
            "Output 1": input_class(input_data_tensor),
            "Output 2": input_class(input_data_tensor)
        }