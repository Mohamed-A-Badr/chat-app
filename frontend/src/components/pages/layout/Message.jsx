import React from 'react'
import "./Message.css"

const Message = ({ message, isCurrentUser }) => {
    const messageClass = isCurrentUser ? "message-sender" : "message-receiver";
    
    return (
        <div className={messageClass}>
            <small>{new Date(message.timestamp).toLocaleDateString()}</small>
            <p>{message.content}</p>
        </div>
    )
}

export default Message;