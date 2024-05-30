"""
This module is responsible for allocating units.
"""

from .unit_objects.input_unit_objects.random_input_unit import RandomInputUnit
from .unit_objects.input_unit_objects.huggingface_dataset_input_unit import HuggingFaceDatasetInputUnit

class UnitObjectAllocator:
    """
    The UnitObjectAllocator class is responsible for allocating units.
    """
    def __init__(self):
        pass

    @staticmethod
    def create_unit_object(unit_id: str, unit_info: dict):
        """
        This method creates an object of the appropriate unit type based on the unit information.

        Args:
            unit_id (str): The unique identifier for the unit.
            unit_info (dict): A dictionary containing information about the unit.

        Returns:
            Unit: An object of the appropriate unit type.
        """
        unit_type = unit_info['type']
        if unit_type == 'randomInput':
            shape = tuple([int(dim) for dim in unit_info['parameters']['dimension']['value']])
            return RandomInputUnit(unit_id, unit_info, shape)
        elif unit_type == 'HF dataset input':
            return HuggingFaceDatasetInputUnit(unit_id, unit_info)
        else:
            raise ValueError(f'Invalid unit type: {unit_type}')