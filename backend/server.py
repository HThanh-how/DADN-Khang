import os
import io
import base64
import numpy as np
from utils import IOTState
from PIL import Image
from flask_cors import CORS 
from deepface import DeepFace
from flask import Flask, request, jsonify
from flask_mqtt import Mqtt

app = Flask(__name__)
CORS(app)  

# MQTT Config
app.config['MQTT_BROKER_URL'] = 'mqtt.ohstem.vn'
app.config['MQTT_BROKER_PORT'] = 1883
app.config['MQTT_USERNAME'] = 'trinhxuankhai' 
app.config['MQTT_PASSWORD'] = '' 
app.config['MQTT_KEEPALIVE'] = 5  
app.config['MQTT_TLS_ENABLED'] = False  

MQTT_USERNAME = "trinhxuankhai"
MQTT_TOPIC_PUB = MQTT_USERNAME + "/feeds/input"
MQTT_TOPIC_PUB_ALARM = MQTT_USERNAME + "/feeds/alarm"
MQTT_TOPIC_SUB = MQTT_USERNAME + "/feeds/output"
mqtt_client = Mqtt(app)

# IOT State
iotState = IOTState()
UPLOAD_FOLDER = 'backend/file_db'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/fetch_data')
def get_temperature():  
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
    
        if name == 'fan':
            if iotState.fan['state']:
                publish_result = mqtt_client.publish(MQTT_TOPIC_PUB, int(iotState.fan['value']))
            else:
                publish_result = mqtt_client.publish(MQTT_TOPIC_PUB, 0)

            print(publish_result)
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

        ref_image_path = r"backend/file_db/khánh/0.jpeg"
        ref_image = np.array(Image.open(ref_image_path))[:, :, ::-1]

        for detect_result in detect_results:
            detect_result = detect_result['facial_area']
            face_region = image[detect_result['y']:detect_result['y']+detect_result['h'], detect_result['x']:detect_result['x']+detect_result['w']]
            
            verify = DeepFace.verify(face_region, 
                                     ref_image,
                                     detector_backend='skip',
                                     model_name='GhostFaceNet')['verified']
            
            if not verify:
                publish_result = mqtt_client.publish(MQTT_TOPIC_PUB_ALARM, 1)
                print('Alarm!!!!')

            bbox = [detect_result['x']/image_w, detect_result['y']/image_h, detect_result['w']/image_w, detect_result['h']/image_h, int(verify)]
            bboxes.append(bbox)
    except:
        return jsonify({'bbox': None})

    return jsonify({'bbox': bboxes})

@mqtt_client.on_connect()
def handle_connect(client, userdata, flags, rc):
    if rc == 0:
        print('Connected successfully')
        mqtt_client.subscribe(MQTT_TOPIC_SUB) # subscribe topic
    else:
        print('Bad connection. Code:', rc)

@mqtt_client.on_message()
def handle_mqtt_message(client, userdata, message):
    data = dict(
        topic=message.topic,
        payload=message.payload.decode()
    )
    
    data['payload'] = eval(data['payload'])
    temperature, humidity, brightness = data['payload'][0], data['payload'][1], data['payload'][2]
    iotState.temperature = temperature
    iotState.humidity = humidity
    iotState.brightness = brightness

if __name__ == '__main__':
   app.run(port=5001, debug=True)


# # Warming up code
# ref_image_path = r"E:\\BK\\232\\smart-home\\backend\\file_db\\khai\\0.jpeg"
# ref_image = np.array(Image.open(ref_image_path))[:, :, ::-1]
# verify = DeepFace.verify(ref_image, 
#                          ref_image,
#                          detector_backend='skip',
#                          model_name='GhostFaceNet')['verified']
# try:
#     DeepFace.extract_faces(ref_image, detector_backend="yunet")
# except:
#     pass