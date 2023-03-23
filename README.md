# Communication between devices and applications

The goals of the following approaches are to show the communication between two applications using socket io protocol (Application Communication) and the communication between devices considering the IoT environment (MQTT Communication).

## Technologies
- Node v18.14.0
- ReactJS 
- Electron
- .NET Core (dotnet v5.0.100)
- C#
- WPF
- Docker v20.10.23, build 7155243
- Docker Compose v2.15.1
- Python v3.8.8
- Mosquitto (MQTT) v2.0.15
- Visual Studio 2019

# Approach 1: Application Communication
This approach will allow the user to perform communication between two applications. Application 1 and Application 2 are able to communicate between each other. Instances of Application 2 can perform unicast/broadcast communication with instances of Application 1, but instances of Application 1 can only broadcast data to all instances of Application 2. There is a node server hosting the server to allow the communications between the applications.

## How to run
### Setup
- Clone or download the repo to your Windows machine
- The simplest approach for running the applications is using Docker + Compose for running the project. Go to the folder "Applications" and run in a terminal:
    - `docker-compose build`
    - `docker-compose up`
- Make sure that you have the following items installed if you want to run the applications in the debug mode:
    - Node
    - Visual Studio 2019

### Server
- Open a terminal in the folder "Server" and run the command `npm install`
- After it finishes. Run the command `node server.js`

### Application 2
#### Debug
##### Nodejs + Electron
- Run `npm install`
- Run `npm run start-electron`

##### Nodejs
- Open a terminal and type `cd "Applications 2"/app`
- Run `npm install`
- Run `npm start`

### Application 1
#### Release
- Go to path "Releases Application/Application 1" and then open the file "Application 1.exe" 
- You can open as many instances as you want for communicating with Application 1
#### Debug
- Go to folder "Application 1" and open "AppInterview.sln" with Visual Studio 2019
- Run the application


# Approach 2: MQTT Communication
The application shows how the multicast communication works for fake IoT devices (bots). The python client is the only one you can control, and all the other clients (bots) listening the topic subscribed will respond every time it receives a message.

### Setup
- Make sure that you have docker and python installed on your machine and.
- In the folder "MQTT", run:
    - `docker-compose build`
    - `docker-compose up`
- Now you also need to install the client dependencies to exchange data with the IoT fake devices, running: `pip install -r ./Client/requirements.txt` 
- Then, start the client running the command: `python ./Client/client.py`