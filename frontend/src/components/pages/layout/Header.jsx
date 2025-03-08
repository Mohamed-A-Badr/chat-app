import React from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Button from '../../auth/features/Button'
import "./Header.css"

const Header = ({ user }) => {
    const navigate = useNavigate();

    // logout state
    const logout = async () => {
        const access = localStorage.getItem("accessToken");
        const refresh = localStorage.getItem("refreshToken");
        const url = "http://localhost:8000/auth/logout/";

        if (!refresh) {
            // If no refresh token, directly clear tokens and redirect
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            navigate('/login');
            return;
        }

        try {
            await axios.post(url, {
                refresh: refresh
            }, {
                headers: {
                    'Authorization': `Bearer ${access}`
                }
            });

            // Clear tokens on successful logout
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");

            // Redirect to login page
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error.response ? error.response.data : error.message);

            // Even if logout fails, clear tokens and redirect
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            navigate('/login');
        }
    }

    // If user is null, return null or a placeholder
    if (!user) {
        return (
            <header>
                <h1>Chat</h1>
                <div className="user-info">
                    <p>Loading...</p>
                </div>
            </header>
        );
    }

    return (
        <header>
            <h1>Chat</h1>
            <div className="user-info">
                <p>{user.username}</p>
                <Button type="button" action="Logout" onClick={logout} />
            </div>
        </header>
    )
};

export default Header;