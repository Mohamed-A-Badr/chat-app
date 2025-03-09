import React from 'react'
import './Input.css'

const Input = ({selector, onKeyUp, onChange, value, type, name, placeholder}) => {
  return (
    <>
        <input className={selector || ""} onKeyUp={onKeyUp} onChange={onChange} value={value} type={type} name={name} placeholder={placeholder}/>
    </>
  )
}

export default Input