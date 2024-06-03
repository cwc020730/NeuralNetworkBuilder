"""
This file builds images for data objects.
"""

import io
import matplotlib.pyplot as plt
from PIL import Image
from . import HuggingfaceImageClassificationDatasetData

class DataImageBuilder:
    """
    The DataImageBuilder class builds images for data objects.
    """

    def __init__(self, data_object):
        """
        Initialize the DataImageBuilder object.

        Args:
            data_object (DataObject): The data object.
        """
        self.data_object = data_object

    def build_image(self):
        """
        Build an image for the data object.

        Returns:
            PIL.Image: The image.
        """
        if isinstance(self.data_object, HuggingfaceImageClassificationDatasetData):
            dataset = self.data_object.get_data()
            # Sample 10 images from the dataset
            sampled_data = dataset.shuffle(seed=42).select(range(10))

            fig, axes = plt.subplots(2, 5, figsize=(12, 5))

            for i, data in enumerate(sampled_data):
                ax = axes[i // 5, i % 5]
                ax.imshow(data['image'], cmap='gray')
                ax.set_title(f"Label: {data['label']}")
                ax.axis('off')

            # set transparent background
            fig.patch.set_alpha(0.0)

            for ax in axes.flatten():
                ax.patch.set_alpha(0.0)

            plt.title('Sample Images')
            plt.tight_layout()
        else:
            return None
        
        buf = io.BytesIO()
        plt.savefig(buf, format='png', transparent=True)
        buf.seek(0)

        return buf