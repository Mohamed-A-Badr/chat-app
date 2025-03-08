import React, { useState, useEffect } from 'react'
import axios from 'axios'
import UserInfo from './UserInfo'
import "./UserList.css"

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            const token = localStorage.getItem('accessToken');

            if (!token) {
                setError('No authentication token found');
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get('http://localhost:8000/auth/users/', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                setUsers(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching users:', err);
                setError('Failed to fetch users');
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    if (loading) {
        return <div className="users-list">Loading users...</div>;
    }

    if (error) {
        return <div className="users-list">Error: {error}</div>;
    }

    return (
        <div className="users-list">
            {users.map(user => (
                <UserInfo
                    key={user.email}
                    username={user.username}
                />
            ))}
        </div>
    );
};

export default UserList;