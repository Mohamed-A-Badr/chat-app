import React from 'react'
import "./Message.css"

const Message = ({ message, isCurrentUser }) => {
    const messageClass = isCurrentUser ? "message-receiver" : "message-sender";

    return (
        <div className={messageClass}>
            <small>{new Date(message.timestamp).toLocaleString()}</small>
            <p>{message.content}</p>
        </div>
    )
}

export default Message;