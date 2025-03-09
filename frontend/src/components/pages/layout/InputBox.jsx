import React from 'react'
import Input from '../../auth/features/Input'
import "./InputBox.css"

const InputBox = () => {
    return (
        <div className="input-box">
            <Input selector="chat-input" type="text" name="message" placeholder="Type your message..." />
            <a href="#" className="chat-button"><img src="src/assets/images/send.svg" alt="send-icon" /></a>
        </div>
    )
}

export default InputBox