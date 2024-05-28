"""
This file contains the Unit class, which is the parent class for all the unit objects
on the canvas.
"""
class Unit:
    """
    The parent class for all the unit objects on the canvas.

    Args:
        unit_id (str): The unique identifier for the unit.
        unit_info (dict): A dictionary containing information about the unit.

    Attributes:
        id (str): The unique identifier for the unit.
        type (str): The type of the unit.
        is_input_unit (bool): A flag indicating if the unit is an input unit.
        input_connections (list): A list of input connections for the unit.
        output_connections (list): A list of output connections for the unit.
        parameters (dict): A dictionary containing the parameters for the unit.
    """
    def __init__(self, unit_id, unit_info):
        self.id = unit_id
        self.type = unit_info['type']
        self.is_input_unit = unit_info['input_unit']
        self.input_connections = unit_info['inputs']
        self.output_connections = unit_info['outputs']
        self.parameters = unit_info['parameters']

    # abstract method
    def execute(self):
        """
        This method is used to execute the unit operation.
        """
        pass

    def __repr__(self):
        return f'Unit ID: {self.id}'
