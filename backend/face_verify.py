import cv2
from deepface import DeepFace

# Extract faces using DeepFace
verify = DeepFace.verify(r"E:\BK\232\smart-home\backend\file_db\khai\0.jpeg", 
                         r"E:\BK\232\smart-home\backend\file_db\khai\0.jpeg",
                         detector_backend='skip',
                         model_name='GhostFaceNet')['verified']
print(verify)