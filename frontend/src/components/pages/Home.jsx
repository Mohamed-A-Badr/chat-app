import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Header from './layout/Header'
import UserList from './layout/UserList'
import "./Home.css"

const Home = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserProfile = async () => {
            const token = localStorage.getItem('accessToken');

            if (!token) {
                // Refresh token
                try {
                    const response = await axios.post('http://localhost:8000/auth/refresh/', {
                        refresh: localStorage.getItem('refreshToken')
                    });
                    localStorage.setItem('accessToken', response.data.access);
                    localStorage.setItem('refreshToken', response.data.refresh);
                } catch (error) {
                    console.error('Error refreshing token:', error);
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    navigate('/login');
                    return;
                }
            }

            try {
                const response = await axios.get('http://localhost:8000/auth/me/', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                setUser(response.data);
                console.log(response.data)
            } catch (error) {
                console.error('Error fetching user profile:', error);

                // If token is invalid or expired, redirect to login
                if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    navigate('/login');
                }
            }
        };

        fetchUserProfile();
    }, [navigate]);

    return (
        <>
            <Header user={user} />
            <main className="chat-container">
                <UserList />
                <div className="chat-window">

                </div>
            </main>
        </>
    )
}

export default Home;