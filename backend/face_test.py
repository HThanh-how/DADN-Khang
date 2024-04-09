import cv2
from deepface import DeepFace

# Load the image
image_path = r"E:\BK\232\smart-home\WIN_20240409_15_34_11_Pro.jpg"
image = cv2.imread(image_path)

# Extract faces using DeepFace
detect_result = DeepFace.extract_faces(image_path, detector_backend="yolov8")[0]['facial_area']
bbox = [detect_result['x'], detect_result['y'], detect_result['w'], detect_result['h']]

# Draw a rectangle around the detected face
x, y, w, h = bbox
cv2.rectangle(image, (x, y), (x + w, y + h), (0, 255, 0), 2)

# Display the image
cv2.imshow("Detected Face", image)
cv2.waitKey(0)
cv2.destroyAllWindows()