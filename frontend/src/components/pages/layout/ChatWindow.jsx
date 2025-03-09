import React from 'react'
import "./ChatWindow.css"
import ChatBox from './ChatBox'
import InputBox from './InputBox'

const ChatWindow = () => {
    return (
        <div className="chat-window">
            <div className="profile">
                <p>Test User</p>
            </div>
            <ChatBox />
            <InputBox />
        </div>
    )
}

export default ChatWindow