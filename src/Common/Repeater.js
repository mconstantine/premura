import React from 'react'
import './Repeater.scss'
import iconRemove from './icon-remove.svg'

export default props => {
  return (
    <div className={'p-Repeater' + (props.error ? ' error' : '')}>
      {props.label ? (
        <label>{props.label}</label>
      ) : null}
      {props.error ? (
        <p>{props.error}</p>
      ) : null}
      {props.items && props.items.length ? props.items.map((item, index) => {
        return (
          <div key={index} className="p-Repeater-item">
            <span>{props.renderItem && props.renderItem(item, index)}</span>
            <img
              src={iconRemove}
              alt="Remove"
              onClick={() => props.removeItem && props.removeItem(item)}
            />
          </div>
        )
      }) : null}
      {props.addItem && props.addItem()}
    </div>
  )
}
