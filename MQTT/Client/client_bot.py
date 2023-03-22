import paho.mqtt.client as mqtt
import os

# assigning clientId from docker to clientid
client_id = os.environ["HOSTNAME"]

def on_connect(client, user_data, flags, rc):
    print(f"Bot Client: {client_id} connected to Mosquitto broker.")
    client.subscribe("bot/topic")

def on_message(client, user_data, msg):
    print(msg.topic + " " + str(msg.payload))
    client.publish("bot/topic/ack", f"Message Received by Bot Client {client_id}")
    
def main():
    client = mqtt.Client(client_id)
    client.on_connect = on_connect
    client.on_message = on_message

    client.connect("mosquitto-broker", 1883, 60)
    client.loop_forever()
    
main()