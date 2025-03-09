import React from 'react'
import './Button.css'

const Button = ({selector, type, action, onClick}) => {
  return (
    <>
        <button 
            className={selector || ""}
            type={type} 
            onClick={typeof onClick === 'function' ? onClick : undefined}
        >
            {action}
        </button>
    </>
  )
}

export default Button;
