import sys
from time import sleep
import paho.mqtt.client as mqtt
from threading import Thread

topic = "bot/topic"
qty_replicas = 3
client_id = "user_client"
client = mqtt.Client(client_id)
message_buffer = []

def on_connect(client, user_data, flags, rc):
    print(f"Client: {client_id} connected to Mosquitto broker. {str(rc)}")
    client.subscribe(f"{topic}/ack")
    client.publish(topic, "Wakeup Bots")

def on_message(client, user_data, msg):
    message_buffer.append(msg.topic + ": " + msg.payload.decode())
    
def start_mqtt_communication():    
    client.on_connect = on_connect
    client.on_message = on_message

    client.connect("host.docker.internal", 1883, 60)    
    
    client.loop_forever()
    
def terminal_interface():    
    while(len(message_buffer) >= qty_replicas):
        for _ in range(len(message_buffer)):
            print(message_buffer.pop())
            
        message = input(f"Enter the message to be sent to all listeners to the topic {topic}: ")
        client.publish(topic, message)   
    
def main():
    thread_mqtt = Thread(target = start_mqtt_communication)
    thread_mqtt.daemon = True
    thread_mqtt.start()
    
    while True:
        try:
            terminal_interface()
            sleep(0.3)
        except KeyboardInterrupt:
            sys.exit()
    
main()