import React, { useState, useEffect } from 'react'
import "./ChatWindow.css"
import ChatBox from './ChatBox'
import InputBox from './InputBox'

const ChatWindow = () => {
    const [username, setUsername] = useState('');

    useEffect(() => {
        // Function to handle the websocket connection event
        const handleWebSocketConnected = (event) => {
            const { username: connectedUsername } = event.detail;
            setUsername(connectedUsername);
        };

        // Add event listener
        window.addEventListener('websocket-connected', handleWebSocketConnected);

        // Cleanup event listener
        return () => {
            window.removeEventListener('websocket-connected', handleWebSocketConnected);
        };
    }, []);

    return (
        <div className="chat-window">
            <div className="profile">
                <p>{username || 'Chat'}</p>
            </div>
            <ChatBox />
            <InputBox />
        </div>
    )
}

export default ChatWindow