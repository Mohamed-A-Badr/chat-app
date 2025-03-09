import React, { useState, useEffect } from 'react'
import "./GroupInfo.css"

const GroupInfo = ({ name }) => {
    const [socket, setSocket] = useState(null);

    const handleJoinGroup = (e) => {
        e.preventDefault();

        // If socket is already open, do nothing
        if (socket && socket.readyState === WebSocket.OPEN) {
            return;
        }

        try {
            const token = localStorage.getItem("accessToken");
            // Create a new WebSocket connection for group chat
            const newSocket = new WebSocket(`ws://localhost:8000/ws/chat/group/${name}/?token=${token}`);

            // Connection opened
            newSocket.addEventListener('open', () => {
                console.log('WebSocket group connection established');
                setSocket(newSocket);
                
                // Dispatch a custom event with the group name
                const connectedEvent = new CustomEvent('websocket-connected', { 
                    detail: { groupName: name } 
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
                console.log('Raw WebSocket group message:', messageEvent.data);
                
                try {
                    // Attempt to parse the message
                    const parsedData = JSON.parse(messageEvent.data);
                    
                    // Dispatch a custom event with the parsed data
                    const event = new CustomEvent('websocket-message', { 
                        detail: parsedData 
                    });
                    window.dispatchEvent(event);
                } catch (parseError) {
                    console.error('Error parsing WebSocket group message:', parseError);
                    console.error('Problematic message data:', messageEvent.data);
                }
            });

            // Handle connection errors
            newSocket.addEventListener('error', (errorEvent) => {
                console.error('WebSocket group error:', errorEvent);
            });

            // Handle connection close
            newSocket.addEventListener('close', () => {
                console.log('WebSocket group connection closed');
                setSocket(null);
            });

        } catch (error) {
            console.error('Failed to establish WebSocket group connection:', error);
        }
    };

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

    return (
        <div className="group-icon">
            <p>{name}</p>
            <a
                className="send-message"
                href="#"
                onClick={handleJoinGroup}
            >
                <img src="/src/assets/images/message.svg" alt="message-icon" />
            </a>
        </div>
    )
}

export default GroupInfo;