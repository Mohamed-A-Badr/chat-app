import React from 'react'
import "./ChatBox.css"
import Message from './Message'


const ChatBox = () => {
    return (
        <div className="chat-box">
            <Message />
        </div>
    )
}

export default ChatBox