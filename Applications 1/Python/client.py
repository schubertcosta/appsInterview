import socketio

SERVER_URL = "http://localhost:3001"


sio = socketio.Client()

@sio.event
def connect():
    print("Python Device Connected: ", sio.sid)
    sio.emit("follower", "Python - Application 1")
    
@sio.event
def disconnect():
    print("Disconnected from server.")

@sio.on('input')
def on_message(data):
    print('I received a message! 2')


def main():
    sio.connect(SERVER_URL)

    try:
        while True:
            True
    except KeyboardInterrupt:
        sio.disconnect()
        exit()

main()