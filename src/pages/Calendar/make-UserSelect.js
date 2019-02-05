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
    let users = await client.get('/users/')
    users = users.content

    this.setState({
      users,
      filteredUsers: users,
      value: this.props.value ? this.props.value._id : ''
    })
  }

  componentWillReceiveProps(nextProps) {
    const newState = {}

    if (nextProps.exclude) {
      newState.filteredUsers = this.state.users.filter(({ _id }) => !nextProps.exclude.includes(_id))
    }

    newState.value = nextProps.value
    this.setState(newState)
  }

  onChange(e) {
    const user = this.state.filteredUsers.find(({ _id }) => e.target.value === _id)

    if (!user) {
      return
    }

    this.props.onChange && this.props.onChange(user)
  }

  render() {
    if (!this.state.filteredUsers || !this.state.filteredUsers.length) {
      return null
    }

    return (
      <label htmlFor={this.props.id} className={this.props.error ? ' error' : ''}>
        {this.props.label ? (
          <span>{this.props.label}</span>
        ) : null}
        {this.props.error ? (
          <p>{this.props.error}</p>
        ) : null}
        <select
          id={this.props.id || null}
          value={this.state.value && this.state.value._id ? this.state.value._id : ''}
          onChange={this.onChange}
          required={this.props.required}
        >
          {!this.state.value || !this.state.value._id ? (
            <option value="">{this.props.emptyLabel || '–'}</option>
          ) : null}
          {this.state.filteredUsers.map(user => (
            <option key={user._id} value={user._id}>{user.name}</option>
          ))}
        </select>
      </label>
    )
  }
}
