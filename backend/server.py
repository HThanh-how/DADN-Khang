import os
import io
import base64
from PIL import Image
from flask_cors import CORS 
from flask import Flask, request, jsonify

UPLOAD_FOLDER = 'backend\\file_db'
app = Flask(__name__)
CORS(app)  

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
    return {'temperature': iotState.temperature,
            'humidity': iotState.humidity,
            'brightness': iotState.brightness}

@app.route('/send_data')
def update_fan():
    value = request.args.get('value')
    type = request.args.get('type')
    name = request.args.get('name')
    
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

    return {'value': value}

@app.route('/save_image', methods=['POST', 'GET'])
def save_image():
    data = request.get_json()
    result = data['image']
    b = bytes(result, 'utf-8')
    image = b[b.find(b'/9'):]
    image = Image.open(io.BytesIO(base64.b64decode(image)))

    image_path = os.path.join(UPLOAD_FOLDER, 'captured_image.jpeg')
    image.save(image_path)

    return jsonify({'message': 'Image saved successfully',
                    'image_path': image_path}), 200

if __name__ == '__main__':
   app.run(port=5000, debug=True)