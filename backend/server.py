from flask import Flask, request

app = Flask(__name__)
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
    print('!!!!')
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

if __name__ == '__main__':
   app.run(port=5000)