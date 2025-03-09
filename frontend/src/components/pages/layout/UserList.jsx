import React, { useState, useEffect } from 'react'
import axios from 'axios'
import UserInfo from './UserInfo'
import "./UserList.css"

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                const response = await axios.get('http://localhost:8000/auth/users/', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setUsers(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchUsers();
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
        <div className="users-list">
            {users.map((user) => (
                <UserInfo
                    key={user.email}
                    username={user.username}
                    id={user.id}
                    isSelected={selectedUser?.id === user.id}
                    onUserSelect={() => handleUserSelect(user)}
                />
            ))}
        </div>
    )
}

export default UserList;