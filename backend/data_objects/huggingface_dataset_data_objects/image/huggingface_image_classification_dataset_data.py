"""
This file contains the HuggingfaceImageClassificationDatasetData class, 
which is a data object class that represents a Huggingface image classification dataset.
"""

from PIL.Image import Image as PILImage
from ..huggingface_dataset_data import HuggingFaceDatasetData

class HuggingfaceImageClassificationDatasetData(HuggingFaceDatasetData):
    """
    The HuggingfaceImageClassificationDatasetData class represents a Huggingface image classification dataset.
    """
    
    def __init__(self, dataset, split, image_column, label_column):
        """
        Initialize the HuggingfaceImageClassificationDatasetData object.

        Args:
            
        """
        super().__init__(dataset, split)
        self.image_column = image_column
        self.label_column = label_column
        self.images = self.dataset[self.image_column]
        self.labels = self.dataset[self.label_column]

    def to_json_dict(self):
        """
        Convert the dataset data to a JSON dictionary.
        """
        image_type = None
        if isinstance(self.images[0], PILImage):
            image_type = 'PIL'
            width_range = (0, float('inf'))
            height_range = (0, float('inf'))
            for _, image in enumerate(self.images):
                width_range = (max(width_range[0], image.width), min(width_range[1], image.width))
                height_range = (max(height_range[0], image.height), min(height_range[1], image.height))

        data = {}
        data['task'] = 'image-classification'
        data['image_type'] = image_type
        data['split'] = self.split
        data['width_range'] = list(width_range)
        data['height_range'] = list(height_range)
        data['image_count'] = len(self.images)
        return data

    def __repr__(self):
        return f'HuggingfaceImageClassificationDatasetData(split={self.split}, image_column={self.image_column}, label_column={self.label_column})'