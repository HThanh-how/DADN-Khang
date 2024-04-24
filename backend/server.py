import os
import io
import base64
import numpy as np
from PIL import Image
from utils import IOTState, save_image_db
from flask_mqtt import Mqtt
from flask_cors import CORS 
from deepface import DeepFace
from flask import Flask, request, jsonify

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
MQTT_TOPIC_PUB_LIGHT = MQTT_USERNAME + "/feeds/light"
MQTT_TOPIC_SUB = MQTT_USERNAME + "/feeds/output"
mqtt_client = Mqtt(app)

# IOT State
iotState = IOTState()
UPLOAD_FOLDER = 'backend/file_db'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Warming up code
try:
    DeepFace.find(img_path=np.zeros([224, 224, 3]),
                db_path='./backend/file_db',
                detector_backend='skip',
                model_name='GhostFaceNet',
                silent=True)
except:
    pass

@app.route('/fetch_data')
def get_temperature():  
    return {'temperature': iotState.temperature,
            'humidity': iotState.humidity,
            'brightness': iotState.brightness}

@app.route('/check_alarm')
def check_alarm():
    value = request.args.get('value')
    if value == 'true':
        publish_result = mqtt_client.publish(MQTT_USERNAME + "/feeds/alarm_active", 1)
    else: 
        publish_result = mqtt_client.publish(MQTT_USERNAME + "/feeds/alarm_active", 0)
    return {'value': value}

@app.route('/send_light')
def send_light():
    value = request.args.get('value')
    type = request.args.get('type')

    if type == 'string':
        iotState.light['value'] = value
    else:
        iotState.light['state'] = True if value == 'true' else False

    if iotState.light['state']:
        publish_result = mqtt_client.publish(MQTT_TOPIC_PUB_LIGHT, value)
    else:
        publish_result = mqtt_client.publish(MQTT_TOPIC_PUB_LIGHT, 'NOTHING')

    return {'value': value}

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
    save_image_db(name, face_region, UPLOAD_FOLDER)
    
    return jsonify({'message': 'Image saved successfully'}), 200

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

        for detect_result in detect_results:
            detect_result = detect_result['facial_area']
            face_region = image[detect_result['y']:detect_result['y']+detect_result['h'], detect_result['x']:detect_result['x']+detect_result['w']]
        
            recog_result = DeepFace.find(img_path=face_region,
                                         db_path='./backend/file_db',
                                         detector_backend='skip',
                                         model_name='GhostFaceNet',
                                         silent=True)[0]
            
            if len(recog_result) == 0:
                verify = False
            else:
                verify = True
            
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


