import React, { Component } from 'react'
import langs from './libs/langs'

export default class Login extends Component {
  constructor(props) {
    super(props)

    this.state = {
      email: '',
      password: '',
      lang: Object.keys(langs)[0]
    }

    this.onEmailChange = this.onEmailChange.bind(this)
    this.onPasswordChange = this.onPasswordChange.bind(this)
    this.onLangChange = this.onLangChange.bind(this)
    this.login = this.login.bind(this)
  }

  onEmailChange(e) {
    this.setState({ email: e.target.value })
  }

  onPasswordChange(e) {
    this.setState({ password: e.target.value })
  }

  onLangChange(e) {
    this.setState({ lang: e.target.value })
  }

  login(e) {
    e.preventDefault()

    this.props.onSubmit && this.props.onSubmit({
      email: this.state.email,
      password: this.state.password,
      lang: this.state.lang
    })
  }

  render() {
    return (
      <div className="p-Login">
        <form onSubmit={this.login}>
          <label htmlFor="email">
            <span>Email:</span>
            <input
              type="email"
              value={this.state.email}
              onChange={this.onEmailChange}
              required
            />
          </label>

          <label htmlFor="password">
            <span>Password:</span>
            <input
              type="password"
              value={this.state.password}
              onChange={this.onPasswordChange}
              required
            />
          </label>

          <label htmlFor="lang">
            <span>Language:</span>
            <select
              value={this.state.lang}
              onChange={this.onLangChange}
              required
            >
              {Object.keys(langs).map(slug => (
                <option key={slug} value={slug}>
                  {langs[slug]}
                </option>
              ))}
            </select>
          </label>

          <input type="submit" value="Login" />
        </form>

        <div className="p-LoginErrors">
          <ul>
            {this.props.errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      </div>
    )
  }
}
