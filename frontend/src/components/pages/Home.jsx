import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Header from './Header'
import "./Home.css"
import Chat from './Chat'


const Home = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserProfile = async () => {
            const token = localStorage.getItem('accessToken');
            const refreshToken = localStorage.getItem('refreshToken');

            if (!token && !refreshToken) {
                // No tokens available, redirect to login
                navigate('/login');
                return;
            }

            try {
                // Try to fetch user profile with current token
                const response = await axios.get('http://localhost:8000/auth/me/', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                setUser(response.data);
                localStorage.setItem('username', response.data.username);
            } catch (error) {
                // If token is invalid, try to refresh
                if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                    try {
                        const refreshResponse = await axios.post('http://localhost:8000/auth/refresh/', {
                            refresh: refreshToken
                        });

                        // Update tokens
                        localStorage.setItem('accessToken', refreshResponse.data.access);
                        // Removed the line that updated the refresh token

                        // Retry fetching user profile with new token
                        const userResponse = await axios.get('http://localhost:8000/auth/me/', {
                            headers: {
                                'Authorization': `Bearer ${refreshResponse.data.access}`
                            }
                        });

                        setUser(userResponse.data);
                    } catch (refreshError) {
                        // Log the refresh error
                        console.error('Token refresh failed:', refreshError);

                        // Refresh failed, clear tokens and redirect to login
                        localStorage.removeItem('accessToken');
                        localStorage.removeItem('refreshToken');
                        navigate('/login');
                    }
                } else {
                    // Other unexpected error
                    console.error('Error fetching user profile:', error);
                    navigate('/login');
                }
            }
        };

        fetchUserProfile();
    }, [navigate]);

    return (
        <>
            <Header user={user} />
            <Chat />
        </>
    )
}

export default Home;