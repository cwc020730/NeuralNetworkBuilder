"""
This unit marks the end of the execution of the a model on the canvas.
"""

from . import Unit

class ModelEndUnit(Unit):
    """
    The ModelEndUnit class is a subclass of the Unit class.

    Args:
        unit_id (str): The ID of the unit.
        unit_info (dict): The information of the unit.
    """
    def __init__(self, unit_id: str, unit_info: dict):
        super().__init__(unit_id, unit_info)

    def execute(self, input_data: dict) -> dict:
        """
        This method is unnecessary for this unit.
        """
        return {"Model output": input_data["Model output"]}
    
    def __repr__(self):
        return f'ModelEndUnit ID: {self.id}'