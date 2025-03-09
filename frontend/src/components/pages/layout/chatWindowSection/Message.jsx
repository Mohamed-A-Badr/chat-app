import React from 'react'
import "./Message.css"

const Message = ({ message, sender, isCurrentUser }) => {
    const messageClass = isCurrentUser ?  "message-sender" : "message-receiver";

    return (
        <div className={messageClass}>
            <small className='sender-name'>{sender}</small>
            <small>{new Date(message.timestamp).toLocaleString()}</small>
            <p>{message.content}</p>
        </div>
    )
}

export default Message;