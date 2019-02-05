import React, { Component } from 'react'
import iconDanger from './icon-danger.svg'
import './DeleteButton.scss'

export default class DeleteButton extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isConfirming: false
    }

    this.onClick = this.onClick.bind(this)
  }

  onClick() {
    if (this.state.isConfirming) {
      this.props.onClick && this.props.onClick()
    }

    this.setState({
      isConfirming: !this.state.isConfirming
    })
  }

  render() {
    return (
      <button
        className="p-DeleteButton"
        onClick={this.onClick}
      >
        {this.state.isConfirming ? (
          <img src={iconDanger} alt="Confirm"/>
        ) : null}
        <span>{this.props.label}</span>
      </button>
    )
  }
}
