import React, { Component } from 'react'

export default ({ client }) => class UserSelect extends Component {
  constructor(props) {
    super(props)

    this.state = {
      users: []
    }

    this.onChange = this.onChange.bind(this)
  }

  async componentDidMount() {
    const users = await client.get('/users/')

    this.setState({
      users: users.content
    })
  }

  onChange(e) {
    const user = this.state.users.find(({ _id }) => e.target.value === _id)

    if (!user) {
      return
    }

    this.props.onChange && this.props.onChange(user)
  }

  render() {
    if (!this.props.currentUser) {
      return null
    }

    const select = (
      <select id={this.props.id || null} value={this.props.currentUser._id} onChange={this.onChange}>
        {this.state.users.map(user => (
          <option key={user._id} value={user._id}>{user.name}</option>
        ))}
      </select>
    )

    if (this.props.id && this.props.label) {
      return (
        <label htmlFor={this.props.id}>
          <span>{this.props.label}</span>
          {select}
        </label>
      )
    }

    return select
  }
}
