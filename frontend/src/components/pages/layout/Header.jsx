import React from 'react'
import Button from '../../auth/features/Button'
import "./Header.css"

const Header = ({ user }) => {
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
                <Button type="button" action="Logout" />
            </div>
        </header>
    )
}

export default Header