import React from 'react'
import "./Message.css"

const Message = () => {
    return (
        <>
            <div className="message-sender">
                <small>2020/10/11</small>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
            </div>
            <div className="message-receiver">
                <small>2020/10/11</small>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
            </div>
        </>
    )
}

export default Message