import React from 'react'
import "./UserInfo.css"

const UserInfo = ({ username }) => {
    return (
        <div className="user-icon">
            <p>{username}</p>
            <a className="send-message" href="#"><img src="/src/assets/images/message.svg" alt="message-icon" /></a>
        </div>
    );
};

export default UserInfo;