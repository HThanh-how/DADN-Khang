from flask import Flask, request, jsonify
from flask_mqtt import Mqtt

app = Flask(__name__)

app.config['MQTT_BROKER_URL'] = 'mqtt.ohstem.vn'
app.config['MQTT_BROKER_PORT'] = 1883
app.config['MQTT_USERNAME'] = 'trinhxuankhai' 
app.config['MQTT_PASSWORD'] = '' 
app.config['MQTT_KEEPALIVE'] = 5  
app.config['MQTT_TLS_ENABLED'] = False  

MQTT_USERNAME = "trinhxuankhai"
MQTT_TOPIC_PUB = MQTT_USERNAME + "/feeds/input"
MQTT_TOPIC_SUB = MQTT_USERNAME + "/feeds/output"

mqtt_client = Mqtt(app)
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
   print('Received message on topic: {topic} with payload: {payload}'.format(**data))


if __name__ == '__main__':
   app.run(port=5000)