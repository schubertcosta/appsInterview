from time import sleep
import paho.mqtt.client as mqtt

client_id = "user_client"

def on_connect(client, user_data, flags, rc):
    print(f"Client: {client_id} connected to Mosquitto broker.", str(rc))
    client.subscribe("bot/topic/ack")
    client.publish("bot/topic", f"Wakeup Bots")

def on_message(client, user_data, msg):
    print(msg.topic + " " + str(msg.payload))
    
def main():
    client = mqtt.Client(client_id)
    client.on_connect = on_connect
    client.on_message = on_message

    client.connect("host.docker.internal", 1883, 60)    
    
    client.loop_forever()
    
main()