import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import TextareaCustom from '../../components/textareaCustom/TextareaCustom';
import socketIOClient from "socket.io-client";

const ENDPOINT = "http://127.0.0.1:3001";
const socket = socketIOClient(ENDPOINT);
socket.on("connect", function(data) {
    socket.emit("master", "ReactJs - Application 2")
});

function CustomButton(props) {
    let { action, buttonText, variant } = props
    return <Button 
        variant={variant ?? "contained"} 
        sx={{ ml: 'auto' }}
        onClick = {() => action()}
        >{buttonText}</Button>
}

export default function Home() {
    const [output, setOutput] = React.useState("");
    const [textAreaValue, setTextAreaValue] = React.useState("");


    React.useEffect(() => {        
        // socket.on('message', message => {
        //     console.log(`Received message from ${socket.id}: ${message}`);
            
        //     // Broadcast the message to all connected sockets
        //     sockets.forEach(s => s.emit('message', message));
        // });
        // socket.on("connect", function(data) {

        //     // socket.emit("message", "uhul")
        // });
    }, []);

    function sendData()  {
        socket.emit("broadcast", textAreaValue)
        console.log(textAreaValue)
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
                            title = "Input" 
                            value = {textAreaValue}
                            onChange = {data => setTextAreaValue(data)}
                            />
                        <br />
                        <TextareaCustom 
                            customButton = { 
                                <CustomButton 
                                    action = ""
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