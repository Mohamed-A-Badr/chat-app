import React, { useState, useEffect } from 'react'
import Input from '../../../auth/features/Input'
import Button from '../../../auth/features/Button'
import "./InputBox.css"

const InputBox = () => {
    const [message, setMessage] = useState('');
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        // Listen for WebSocket connection event
        const handleWebSocketConnected = (event) => {
            const { username } = event.detail;
            console.log('WebSocket connected for user:', username);
        };

        // Listen for the socket from the WebSocket connection
        const handleSocketCreated = (event) => {
            const { socket: newSocket } = event.detail;
            setSocket(newSocket);
        };

        // Add event listeners
        window.addEventListener('websocket-connected', handleWebSocketConnected);
        window.addEventListener('socket-created', handleSocketCreated);

        // Cleanup event listeners
        return () => {
            window.removeEventListener('websocket-connected', handleWebSocketConnected);
            window.removeEventListener('socket-created', handleSocketCreated);
        };
    }, []);

    const handleMessageChange = (e) => {
        setMessage(e.target.value);
    };

    const sendMessage = () => {
        // Trim the message and check if it's not empty
        const trimmedMessage = message.trim();
        if (!trimmedMessage) return;

        // Check if socket is open
        if (socket && socket.readyState === WebSocket.OPEN) {
            try {
                // Prepare the message payload
                const messagePayload = JSON.stringify({
                    type: 'message',
                    message: trimmedMessage
                });

                // Send the message through the WebSocket
                socket.send(messagePayload);

                // Clear the input after sending
                setMessage('');
            } catch (error) {
                console.error('Error sending WebSocket message:', error);
            }
        } else {
            console.error('WebSocket is not open. Cannot send message.');
        }
    };

    const handleKeyDown = (e) => {
        // Send message when Enter key is pressed
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevent default form submission
            sendMessage();
        }
    };

    const handleSendClick = (e) => {
        e.preventDefault();
        sendMessage();
    };

    return (
        <div className="input-box">
            <Input
                selector="chat-input"
                type="text"
                name="message"
                placeholder="Type your message..."
                value={message}
                onChange={handleMessageChange}
                onKeyUp={handleKeyDown}
            />
            <a
                href="#"
                className="chat-button"
                onClick={handleSendClick}
            >
                <img src="/src/assets/images/send.svg" alt="send-icon" />
            </a>
        </div>
    );
};

export default InputBox;