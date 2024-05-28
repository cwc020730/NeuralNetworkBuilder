"""
This file contains the RandomInputUnit class, which is a subclass of the InputUnit class.
"""

from ..input_unit import InputUnit

class RandomInputUnit(InputUnit):
    """
    The RandomInputUnit class is a subclass of the InputUnit class and represents a 
    random input unit on the canvas.

    Args:
        unit_id (str): The unique identifier for the unit.
        unit_info (dict): A dictionary containing information about the unit.
    """
    def __init__(self, unit_id, unit_info):
        super().__init__(unit_id, unit_info)

    def execute(self):
        """
        This method is used to execute the unit operation.
        """
        pass

    def __repr__(self):
        return f'RandomInputUnit({self.id})'