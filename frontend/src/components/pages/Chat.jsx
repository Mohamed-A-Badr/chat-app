import React from 'react'
import "./Chat.css"
import UserList from './layout/UserList'
import ChatWindow from './layout/ChatWindow'


const Chat = () => {
    return (
        <main className="chat-container">
            <UserList />
            <ChatWindow />
        </main>
    )
}

export default Chat