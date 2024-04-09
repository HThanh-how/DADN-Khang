import os
import io
import base64
from PIL import Image
import numpy as np
from flask_cors import CORS 
from deepface import DeepFace
from flask import Flask, request, jsonify

UPLOAD_FOLDER = 'backend\\file_db'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app = Flask(__name__)
CORS(app)  

# Warming up code
ref_image_path = r"E:\\BK\\232\\smart-home\\backend\\file_db\\khai\\0.jpeg"
ref_image = np.array(Image.open(ref_image_path))[:, :, ::-1]
verify = DeepFace.verify(ref_image, 
                         ref_image,
                         detector_backend='skip',
                         model_name='GhostFaceNet')['verified']
try:
    DeepFace.extract_faces(ref_image, detector_backend="yunet")
except:
    pass

class IOTState:
    def __init__(self):
        self.fan: dict = {'state': 0, # 0 - off, 1 - on
                          'value': 0}
        self.light: dict = {'state': 0, # 0 - off, 1 - on
                            'value': 0}
        self.temperature: float = 0
        self.humidity: float = 0
        self.brightness: float = 0

iotState = IOTState()

@app.route('/fetch_data')
def get_temperature():
    iotState.temperature = iotState.temperature + 1
    iotState.humidity = iotState.humidity + 1
    iotState.brightness = iotState.brightness + 1
    
    return {'temperature': iotState.temperature,
            'humidity': iotState.humidity,
            'brightness': iotState.brightness}

@app.route('/send_data')
def update_fan():
    value = request.args.get('value')
    type = request.args.get('type')
    name = request.args.get('name')
    
    try:
        if name == 'fan':
            upObject = iotState.fan
        else:
            upObject = iotState.light

        if type == 'int':
            upObject['value'] = int(value)
            print(f'{name} value: {int(value)}')
        else:
            value = True if value == 'true' else False
            upObject['state'] = value
            print(f'{name} state: {bool(value)}')
    except:
        pass
     
    return {'value': value}

@app.route('/save_image', methods=['POST', 'GET'])
def save_image():
    data = request.get_json()
    result = data['image']
    name = data['name'].lower()

    b = bytes(result, 'utf-8')
    image = b[b.find(b'/9'):]
    image = Image.open(io.BytesIO(base64.b64decode(image)))
    image = np.array(image)[:, :, ::-1]

    detect_result = DeepFace.extract_faces(image, detector_backend="yolov8")[0]['facial_area']
    bbox = [detect_result['x'], detect_result['y'], detect_result['w'], detect_result['h']]

    x, y, w, h = bbox
    face_region = image[y:y+h, x:x+w, ::-1]

    os.makedirs(os.path.join(UPLOAD_FOLDER, name), exist_ok=True)
    image_path = os.path.join(UPLOAD_FOLDER, name, f'0.jpeg')
    face_image = Image.fromarray(face_region)
    face_image.save(image_path)

    return jsonify({'message': 'Image saved successfully',
                    'image_path': image_path}), 200

@app.route('/process_frame', methods=['POST', 'GET'])
def get_bbox():
    data = request.get_json()
    image_byte = data['frame']
    
    try:
        b = bytes(image_byte, 'utf-8')
    except:
        return jsonify({'bbox': None})

    image = b[b.find(b'/9'):]
    image = Image.open(io.BytesIO(base64.b64decode(image)))
    image = np.array(image)[:, :, ::-1]
    image_h, image_w = image.shape[:2]

    try:
        bboxes = []
        detect_results = DeepFace.extract_faces(image, detector_backend="yunet")

        ref_image_path = r"E:\\BK\\232\\smart-home\\backend\\file_db\\khai\\0.jpeg"
        ref_image = np.array(Image.open(ref_image_path))[:, :, ::-1]

        for detect_result in detect_results:
            detect_result = detect_result['facial_area']
            face_region = image[detect_result['y']:detect_result['y']+detect_result['h'], detect_result['x']:detect_result['x']+detect_result['w']]
            
            verify = DeepFace.verify(face_region, 
                                     ref_image,
                                     detector_backend='skip',
                                     model_name='GhostFaceNet')['verified']
                        
            bbox = [detect_result['x']/image_w, detect_result['y']/image_h, detect_result['w']/image_w, detect_result['h']/image_h, int(verify)]
            bboxes.append(bbox)
    except:
        return jsonify({'bbox': None})

    return jsonify({'bbox': bboxes})

if __name__ == '__main__':
   app.run(port=5000, debug=True)
    # app.run(port=5000)