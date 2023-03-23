import paho.mqtt.client as mqtt
import os

# assigning clientId from docker to clientid
client_id = os.environ["HOSTNAME"]
bot_topic = os.environ["SUBTOPIC"]

def on_connect(client, user_data, flags, rc):
    print(f"Bot Client: {client_id} connected to Mosquitto broker.")
    client.subscribe(bot_topic)

def on_message(client, user_data, msg):
    print(f"{client_id} | {msg.topic}: {msg.payload.decode()}")
    client.publish(f"{bot_topic}/ack", f"Message Received by Bot Client {client_id}")
    
def main():
    client = mqtt.Client(client_id)
    client.on_connect = on_connect
    client.on_message = on_message

    client.connect("mosquitto-broker", 1883, 60)
    client.loop_forever()
    
main()