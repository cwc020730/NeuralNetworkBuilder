"""
This module is responsible for allocating units.
"""

from . import (
    RandomInputUnit,
    HuggingFaceDatasetInputUnit,
    DatasetSplitUnit,
    IntegerToOneHotUnit,
    ToTensorUnit,
    ModelEndUnit,
    ToDataloaderUnit,
    SGDUnit,
    CrossEntropyLossUnit,
    FlattenUnit,
    LinearUnit,
    ReLUUnit,
    Conv2DUnit
)

class UnitObjectAllocator:
    """
    The UnitObjectAllocator class is responsible for allocating units.
    """

    UNIT_OBJ_MAP = {
        'randomInput': RandomInputUnit,
        'HF dataset input': HuggingFaceDatasetInputUnit,
        'dataset split': DatasetSplitUnit,
        'int to one-hot': IntegerToOneHotUnit,
        'to tensor': ToTensorUnit,
        'model end': ModelEndUnit,
        'to dataloader': ToDataloaderUnit,
        "SGD": SGDUnit,
        "cross entropy loss": CrossEntropyLossUnit,
        "linear": LinearUnit,
        "flatten": FlattenUnit,
        "relu": ReLUUnit,
        "conv2d": Conv2DUnit
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