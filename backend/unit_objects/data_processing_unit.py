"""
The DataProcessingUnit class is a subclass of the Unit class and represents a data 
processing unit on the canvas.
"""
from .unit import Unit

class DataProcessingUnit(Unit):
    """
    The DataProcessingUnit class is a subclass of the Unit class and represents a data processing unit on the canvas.

    Args:
        unit_id (str): The unique identifier for the unit.
        unit_info (dict): A dictionary containing information about the unit.
    """
    def __init__(self, unit_id, unit_info):
        super().__init__(unit_id, unit_info)
        assert self.input_connections != [], 'DataProcessingUnit must have at least one input connection'
        assert self.output_connections != [], 'DataProcessingUnit must have at least one output connection'

    def execute(self):
        """
        This method is used to execute the unit operation.

        Returns:
            dict: A dictionary containing the output data.
        """
        raise NotImplementedError

    def __repr__(self):
        return f'DataProcessingUnit({self.id})'
