"""
The InputUnit class is a subclass of the Unit class and represents an input unit on the canvas.
"""
from unit import Unit

class InputUnit(Unit):
    """
    The InputUnit class is a subclass of the Unit class and represents an input unit on the canvas.

    Args:
        unit_id (str): The unique identifier for the unit.
        unit_info (dict): A dictionary containing information about the unit.
    """
    def __init__(self, unit_id, unit_info):
        super().__init__(unit_id, unit_info)
        assert self.is_input_unit, 'InputUnit must have is_input_unit set to True'
        assert self.input_connections == [], 'InputUnit cannot have any input connections'
        assert len(self.output_connections) >= 1, 'InputUnit must have at least one output connection'
