import React from 'react'
import './Input.css'

const Input = ({ onChange, value, type, name, placeholder}) => {
  return (
    <>
        <input onChange={onChange} value={value} type={type} name={name} placeholder={placeholder}/>
    </>
  )
}

export default Input