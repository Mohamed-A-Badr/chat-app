import React from 'react'
import "./Chat.css"
import ChatList from './layout/chatListSection/ChatList'
import ChatWindow from './layout/chatWindowSection/ChatWindow'


const Chat = () => {
    return (
        <main className="chat-container">
            <ChatList />
            <ChatWindow />
        </main>
    )
}

export default Chat