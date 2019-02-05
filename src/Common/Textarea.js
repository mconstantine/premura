import React from 'react'

export default props => {
  const resize = e => {
    e.target.style.height = 'auto'
    e.target.style.height = e.target.scrollHeight + 'px'
  }

  return (
    <label htmlFor={props.id}>
      {props.label ? (
        <span>{props.label}</span>
      ) : null}
      <textarea
        id={props.id}
        cols="30"
        rows="2"
        value={props.value}
        onChange={props.onChange}
        onKeyDown={resize}
      />
    </label>
  )
}
