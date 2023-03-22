# Communication between devices and applications

The goals of the following the following approaches were to show the communication between two applications using socket io protocol (Application Communication) and the communication between devices considering the IoT environment (MQTT Communication).

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

# Approach 1: Application Communication
The following approach will allow the user to perform communication between two applications. Application 1 and Application 2 are able to communicate between each other. Instances of Application 1 can perform unicast/broadcast communication with instances of Application 2, but instances of Application 2 can only broadcast data to all instances of Application 1. For allowing this communication happen, there is a node server hosting which connect all clients.

## How to run
### Setup
- Make sure that you have the following applications installed:
    - Node
    - Visual Studio (debug)
- Clone or download the repo to your windows

### Server
- Open a terminal in the folder "Server" and run the command `npm install`
- After it finishes. Run the command `node server.js`

### Application 2
#### Release
#### Nodejs + Electron









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
#### Debug
- Go to folder "Application 1" and open "AppInterview.sln"
- Run the application

# Approach 2: MQTT Communication
# 
powershell docker-compose build & docker-compose up && powershell python ./Client/client.py