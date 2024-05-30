"""
This module is responsible for allocating units.
"""

from .unit_objects.input_unit_objects.random_input_unit import RandomInputUnit
from .unit_objects.input_unit_objects.huggingface_dataset_input_unit import HuggingFaceDatasetInputUnit
from .unit_objects.data_processing_unit_objects.dataset_split_unit import DatasetSplitUnit
from .unit_objects.data_processing_unit_objects.integer_to_onehot_unit import IntegerToOneHotUnit

class UnitObjectAllocator:
    """
    The UnitObjectAllocator class is responsible for allocating units.
    """

    UNIT_OBJ_MAP = {
        'randomInput': RandomInputUnit,
        'HF dataset input': HuggingFaceDatasetInputUnit,
        'dataset split': DatasetSplitUnit,
        'int to one-hot': IntegerToOneHotUnit
    }

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
        if unit_type in UnitObjectAllocator.UNIT_OBJ_MAP:
            return UnitObjectAllocator.UNIT_OBJ_MAP[unit_type](unit_id, unit_info)
        else:
            raise ValueError(f'Invalid unit type: {unit_type}')