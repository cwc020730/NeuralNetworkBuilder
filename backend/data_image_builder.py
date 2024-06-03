"""
This file builds images for data objects.
"""

import io
import matplotlib.pyplot as plt
from PIL import Image
from . import HuggingfaceImageClassificationDatasetData

plt.rcParams['text.color'] = 'white'
plt.rcParams['axes.labelcolor'] = 'white'
plt.rcParams['xtick.color'] = 'white'
plt.rcParams['ytick.color'] = 'white'
plt.rcParams['axes.titlecolor'] = 'white'

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
            # Sample 4 images from the dataset
            sampled_data = dataset.shuffle(seed=42).select(range(5))

            fig, axes = plt.subplots(1, 5, figsize=(12, 3))

            for i, data in enumerate(sampled_data):
                ax = axes[i]
                ax.imshow(data['image'], cmap='gray')
                # Place the label below the image
                if self.data_object.label_mapping is not None:
                    label = self.data_object.label_mapping[data['label']]
                else:
                    label = data[self.data_object.label_column]
                ax.text(0.5, -0.15, f"{label}",
                    size=12, ha='center', transform=ax.transAxes)
                ax.axis('off')

            # set transparent background
            fig.patch.set_alpha(0.0)

            for ax in axes.flatten():
                ax.patch.set_alpha(0.0)

            plt.tight_layout()
        else:
            return None
        
        buf = io.BytesIO()
        plt.savefig(buf, format='png', transparent=True)
        buf.seek(0)

        return buf