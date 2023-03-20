import React, { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import TextareaCustom from '../../components/textareaCustom/TextareaCustom';
import { FormControl, MenuItem } from '@mui/material';
import Select from '@mui/material/Select';
import { socket } from '../../service/socket';

const broadcastTag = "Broadcast"

function CustomButton(props) {
    let { action, buttonText, variant } = props
    return <Button 
        variant={variant ?? "contained"} 
        sx={{ ml: 'auto' }}
        onClick = {() => action()}>{buttonText}</Button>
}

export default function Home() {
    const [output, setOutput] = useState("");
    const [textAreaValue, setTextAreaValue] = useState("");
    const [deviceList, setDeviceList] = useState([broadcastTag])
    const [selectedDevice, setSelectedDevice] = useState(deviceList[0]);

    useEffect(() => {
        socket.on("connect", function() {    
            socket.on("deviceList", (newDeviceList) => {
                if(!newDeviceList.includes(selectedDevice))
                    setSelectedDevice(broadcastTag)
                setDeviceList([broadcastTag, ...newDeviceList])
            })         
            socket.on("input", (data) => addOutputToTextarea(data))   

            socket.on('disconnect', (reason) => {
                socket.disconnect()
            });
        });

        const connectAndRegisterListener = () => {   
            socket.emit("leader", "ReactJs - Application 2")
        }
        socket.on("connect", connectAndRegisterListener)        
        return () => {
            socket.off("connect", connectAndRegisterListener)
        };
    }, [setSelectedDevice, setDeviceList, selectedDevice]);

    function addOutputToTextarea(data) {
        const separator = "\n"
        setOutput((prevOuput) => {
            let splitedPrevOutput = prevOuput === "" ? [] : prevOuput.split(separator)

            if(splitedPrevOutput.length > 10)
                splitedPrevOutput.shift()
            
            splitedPrevOutput.push(data)

            return splitedPrevOutput.join(separator)
        })  
    }

    function sendData()  {
        if(selectedDevice === broadcastTag)
            socket.emit(broadcastTag.toLowerCase(), textAreaValue)
        else {
            const dto = { target: selectedDevice, message: textAreaValue }
            socket.emit("unicast", dto)
        }        
    }   

    function SelectDevice() {
        return (<Box sx={{ minWidth: 250 }} >
            <FormControl>
                <Select
                    value={selectedDevice}
                    onChange={(e) => setSelectedDevice(e.target.value)}    
                >
                    {deviceList.map(device => <MenuItem key={device} value={device}>{device}</MenuItem>)}
                </Select>
            </FormControl>
        </Box>)
    }

    return (
        <div>
            <CssBaseline />
            <AppBar position="relative">
                <Toolbar>
                    <Typography variant="h6" color="inherit" noWrap>
                        Application 2
                    </Typography>
                </Toolbar>
            </AppBar>
            <main>
                <Box
                    sx={{
                        bgcolor: 'background.paper',
                        pt: 8,
                        pb: 6,
                    }}
                >
                    <Container maxWidth="sm">
                        <TextareaCustom 
                            customButton = { 
                                <CustomButton 
                                    action = {() => sendData()}
                                    buttonText = "Send" /> }
                            selectDevice = {<SelectDevice />}
                            title = "Input" 
                            value = {textAreaValue}
                            onChange = {data => setTextAreaValue(data)}
                            />
                        <br />
                        <TextareaCustom 
                            customButton = { 
                                <CustomButton 
                                    action = {() => setOutput("")}
                                    buttonText = "Clear" 
                                    variant="outlined" /> }
                            title = "Output"
                            isReadOnly = {true}
                            minQtyRows = {10}
                            output = {output}
                            />
                    </Container>
                </Box>
            </main>
        </div>
    );
}