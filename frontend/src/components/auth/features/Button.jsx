import React from 'react'
import './Button.css'

const Button = ({type, action, onClick}) => {
  return (
    <>
        <button 
            type={type} 
            onClick={typeof onClick === 'function' ? onClick : undefined}
        >
            {action}
        </button>
    </>
  )
}

export default Button;
