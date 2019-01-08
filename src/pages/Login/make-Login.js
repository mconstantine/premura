import React, { Component } from 'react'
import langs from '../../libs/langs'

export default ({ PremuraContext }) => class Login extends Component {
  static contextType = PremuraContext

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
    this.onSubmit = this.onSubmit.bind(this)
  }

  onEmailChange(e) {
    this.setState({ email: e.target.value })
  }

  onPasswordChange(e) {
    this.setState({ password: e.target.value })
  }

  onLangChange(e) {
    this.context.gt.setLocale(e.target.value)
    this.setState({ lang: e.target.value })
  }

  onSubmit(e) {
    e.preventDefault()

    this.props.onSubmit && this.props.onSubmit({
      email: this.state.email,
      password: this.state.password,
      lang: this.state.lang
    })
  }

  render() {
    const gt = this.context.gt

    return (
      <div className="p-Login">
        <form onSubmit={this.onSubmit}>
          <label htmlFor="email">
            <span>{gt.gettext('Email:')}</span>
            <input
              id="email"
              type="email"
              value={this.state.email}
              onChange={this.onEmailChange}
              required
            />
          </label>

          <label htmlFor="password">
            <span>{gt.gettext('Password:')}</span>
            <input
              id="password"
              type="password"
              value={this.state.password}
              onChange={this.onPasswordChange}
              required
            />
          </label>

          <label htmlFor="lang">
            <span>{gt.gettext('Language:')}</span>
            <select
              id="lang"
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

          <input type="submit" value={gt.gettext('Login')} />

          <div className="p-LoginErrors">
            <ul>
              {this.props.errors && this.props.errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        </form>
      </div>
    )
  }
}
