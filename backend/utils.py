import os
import glob
from PIL import Image

class IOTState:
    def __init__(self):
        self.fan: dict = {'state': 0, # 0 - off, 1 - on
                          'value': 0}
        self.light: dict = {'state': 0, # 0 - off, 1 - on
                            'value': 0}
        self.temperature: float = 0
        self.humidity: float = 0
        self.brightness: float = 0
        
def save_image_db(name, image, upload_folder):
    image_pattern = os.path.join(upload_folder, f'{name}_*.jpeg') 
    all_image = glob.glob(image_pattern)
    save_idx = len(all_image)

    image_path = os.path.join(upload_folder, f'{name}_{save_idx}.jpeg')
    face_image = Image.fromarray(image)
    face_image.save(image_path)