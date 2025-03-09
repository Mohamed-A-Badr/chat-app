import React, { useState, useEffect } from 'react'
import axios from 'axios'
import UserInfo from './privateChat/UserInfo'
import GroupInfo from './groupChat/GroupInfo'
import "./ChatList.css"

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                const responseUser = await axios.get('http://localhost:8000/auth/users/', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const responseGroup = await axios.get("http://localhost:8000/chat/group/list/", {
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                })
                setUsers(responseUser.data);
                setGroups(responseGroup.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchChats();
    }, []);

    const handleUserSelect = (user) => {
        // Dispatch an event to close the current WebSocket connection
        const closeEvent = new CustomEvent('close-websocket', {
            detail: { previousUser: selectedUser }
        });
        window.dispatchEvent(closeEvent);

        // Set the newly selected user
        setSelectedUser(user);
    };

    if (loading) {
        return <div className="users-list">Loading...</div>;
    }

    if (error) {
        setTimeout(() => {
            window.location.reload();
        }, 3000);
        return <div className="users-list">Error: {error}. Reloading...</div>;
    }

    return (
        <div className="chat-list">
            <h2 className="chat-title">Private Chat</h2>
            {users.map((user) => (
                <UserInfo
                    key={user.email}
                    username={user.username}
                    id={user.id}
                    isSelected={selectedUser?.id === user.id}
                    onUserSelect={() => handleUserSelect(user)}
                />
            ))}
            <h2 className="chat-title">Group Chat</h2>
            {groups.map((group, index) => (
                <GroupInfo key={index} name={group.name} />
            ))}
        </div>
    )
}

export default UserList;