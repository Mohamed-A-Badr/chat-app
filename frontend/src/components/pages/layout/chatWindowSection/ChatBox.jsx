import React, { useState, useEffect } from 'react'
import Message from './Message'
import "./ChatBox.css"

const ChatBox = () => {
    const [messages, setMessages] = useState([]);
    const currentUsername = localStorage.getItem("username");

    useEffect(() => {
        // Function to handle WebSocket messages
        const handleWebSocketMessage = (event) => {
            // Log the raw message for debugging
            console.log('Raw WebSocket message event:', event);
            console.log('Raw WebSocket message detail:', event.detail);

            // Safely parse the message
            let data;
            try {
                // Try parsing if it's a string
                if (typeof event.detail === 'string') {
                    data = JSON.parse(event.detail);
                } 
                // If it's already an object, use it directly
                else if (typeof event.detail === 'object') {
                    data = event.detail;
                } 
                // If it's neither string nor object, throw an error
                else {
                    throw new Error('Unexpected message format');
                }

                // Log the parsed data
                console.log('Parsed WebSocket data:', data);
                
                // Check if this is a history message
                if (data.history) {
                    // Map the history messages to the expected format
                    const historyMessages = data.history.map(msg => ({
                        content: msg.message,
                        sender: msg.sender,
                        timestamp: msg.timestamp,
                        group: msg.group
                    }));
                    setMessages(historyMessages);
                } else if (data.message) {
                    // Add new message to the existing messages
                    const newMessage = {
                        content: data.message,
                        sender: data.sender,
                        timestamp: data.timestamp,
                        group: data.group
                    };
                    setMessages(prevMessages => [...prevMessages, newMessage]);
                }
            } catch (error) {
                console.error('Error parsing WebSocket message:', error);
                console.error('Problematic message data:', event.detail);
            }
        };

        // Add event listeners
        
        
        window.addEventListener('websocket-message', handleWebSocketMessage);
        window.addEventListener("group-websocket-message", handleWebSocketMessage);

        // Cleanup event listeners
        return () => {
            
            
            window.removeEventListener('websocket-message', handleWebSocketMessage);
            window.removeEventListener("group-websocket-message", handleWebSocketMessage);
        };
    }, []);

    return (
        <div className="chat-box">
            {messages.map((message, index) => (
                <Message 
                    key={index} 
                    message={message} 
                    sender={message.sender}
                    isCurrentUser={message.sender === currentUsername}
                />
            ))}
        </div>
    );
};

export default ChatBox;