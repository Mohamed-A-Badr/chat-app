import React from 'react'
import './Button.css'

const Button = ({type, action}) => {
  return (
    <>
        <button type={type}>{action}</button>
    </>
  )
}

export default Button