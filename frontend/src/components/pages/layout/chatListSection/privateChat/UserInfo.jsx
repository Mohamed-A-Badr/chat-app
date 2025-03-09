import React, { useState, useEffect } from 'react'
import "./UserInfo.css"

const UserInfo = ({ username, id, isSelected, onUserSelect }) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        // Listen for close WebSocket event
        const handleCloseWebSocket = () => {
            // Close existing socket if it exists
            if (socket && socket.readyState === WebSocket.OPEN) {
                socket.close();
                setSocket(null);
            }
        };

        // Add event listener for closing WebSocket
        window.addEventListener('close-websocket', handleCloseWebSocket);

        // Cleanup event listener
        return () => {
            window.removeEventListener('close-websocket', handleCloseWebSocket);
            
            // Close socket when component unmounts
            if (socket && socket.readyState === WebSocket.OPEN) {
                socket.close();
            }
        };
    }, [socket]);

    const handleSendMessage = (e) => {
        e.preventDefault();

        // If socket is already open, do nothing
        if (socket && socket.readyState === WebSocket.OPEN) {
            return;
        }

        // Call user select handler
        onUserSelect();

        try {
            const token = localStorage.getItem("accessToken");
            // Create a new WebSocket connection
            const newSocket = new WebSocket(`ws://localhost:8000/ws/chat/private/${id}/?token=${token}`);

            // Connection opened
            newSocket.addEventListener('open', () => {
                console.log('WebSocket connection established');
                setSocket(newSocket);
                
                // Dispatch a custom event with the username
                const connectedEvent = new CustomEvent('websocket-connected', { 
                    detail: { username: username } 
                });
                window.dispatchEvent(connectedEvent);

                // Dispatch a custom event with the socket
                const socketEvent = new CustomEvent('socket-created', {
                    detail: { socket: newSocket }
                });
                window.dispatchEvent(socketEvent);
            });

            // Listen for messages
            newSocket.addEventListener('message', (messageEvent) => {
                console.log('Raw WebSocket message:', messageEvent.data);
                
                try {
                    // Attempt to parse the message
                    const parsedData = JSON.parse(messageEvent.data);
                    
                    // Dispatch a custom event with the parsed data
                    const event = new CustomEvent('websocket-message', { 
                        detail: parsedData 
                    });
                    window.dispatchEvent(event);
                } catch (parseError) {
                    console.error('Error parsing WebSocket message:', parseError);
                    console.error('Problematic message data:', messageEvent.data);
                }
            });

            // Handle connection errors
            newSocket.addEventListener('error', (errorEvent) => {
                console.error('WebSocket error:', errorEvent);
            });

            // Handle connection close
            newSocket.addEventListener('close', () => {
                console.log('WebSocket connection closed');
                setSocket(null);
            });

        } catch (error) {
            console.error('Failed to establish WebSocket connection:', error);
        }
    };

    return (
        <div 
            className={`user-icon ${isSelected ? 'selected' : ''}`}
            onClick={onUserSelect}
        >
            <p>{username}</p>
            <a
                className="send-message"
                href="#"
                onClick={handleSendMessage}
            >
                <img src="/src/assets/images/message.svg" alt="message-icon" />
            </a>
        </div>
    );
};

export default UserInfo;