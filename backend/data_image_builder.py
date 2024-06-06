"""
This file builds images for data objects.
"""

import io
import matplotlib.pyplot as plt
from PIL import Image
from . import (
    TensorData,
    HuggingfaceImageClassificationDatasetData,
    LossData,
    AccuracyData
)

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

            for ax in axes.flatten():
                ax.patch.set_alpha(0.0)

        elif isinstance(self.data_object, LossData):
            loss_vs_epoch = self.data_object.get_data()
            fig = plt.figure(figsize=(12, 3))
            plt.plot(loss_vs_epoch, marker='o')
            plt.xlabel('Epoch')
            plt.ylabel('Loss')
            plt.xticks(range(len(loss_vs_epoch)))
        elif isinstance(self.data_object, AccuracyData):
            accuracy_vs_epoch = self.data_object.get_data()
            fig = plt.figure(figsize=(12, 3))
            plt.plot(accuracy_vs_epoch, marker='o')
            plt.xlabel('Epoch')
            plt.ylabel('Accuracy')
            plt.xticks(range(len(accuracy_vs_epoch)))
        elif isinstance(self.data_object, TensorData):
            # check if the shape of the tensor is visualizable
            if len(self.data_object.shape) != 4:
                return None
            [b, c, h, w] = self.data_object.shape
            if c not in [1, 3]:
                return None
            # select at most 5 images from b
            num_images = min(b, 5)
            fig, axes = plt.subplots(1, num_images, figsize=(12, 3))
            for i in range(num_images):
                ax = axes[i]
                if c == 1:
                    ax.imshow(self.data_object.tensor[i, 0, :, :].tolist(), cmap='gray')
                else:
                    ax.imshow(self.data_object.tensor[i].tolist().permute(1, 2, 0))
                ax.axis('off')
            for ax in axes.flatten():
                ax.patch.set_alpha(0.0)
        else:
            return None
        
        plt.tight_layout()
        fig.patch.set_alpha(0.0)
        buf = io.BytesIO()
        plt.savefig(buf, format='png', transparent=True)
        buf.seek(0)

        return buf