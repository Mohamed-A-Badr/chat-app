import React from 'react'
import './Input.css'

const Input = ({selector, onChange, value, type, name, placeholder}) => {
  return (
    <>
        <input className={selector || ""} onChange={onChange} value={value} type={type} name={name} placeholder={placeholder}/>
    </>
  )
}

export default Input