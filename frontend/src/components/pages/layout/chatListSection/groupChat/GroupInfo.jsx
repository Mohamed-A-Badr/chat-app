import React from 'react'
import "./GroupInfo.css"

const GroupInfo = ({ name }) => {
    return (
        <div className="group-icon">
            <p>{name}</p>
            <a
                className="send-message"
                href="#"
            >
                <img src="/src/assets/images/message.svg" alt="message-icon" />
            </a>
        </div>
    )
}

export default GroupInfo