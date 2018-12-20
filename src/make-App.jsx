import React, { Component } from 'react'

export default ({ client, Login, Main }) => class App extends Component {
  constructor(props) {
    super(props)
    this.state = { session: null, errors: [] }
  }

  async componentDidMount() {
    const response = await client.get('/users/me/')

    if (response.status !== 200) {
      return
    }

    this.setState({ session: response.content })
  }

  async login({ email, password, lang }) {
    this.setState({ errors: [] })

    const response = await client.post('/users/login/', { email, password, lang })

    if (response.status !== 200) {
      if (response.content.errors && response.content.errors.length) {
        this.setState({ errors: response.content.errors.map(({ msg }) => msg) })
      }

      return
    }

    this.setState({ session: response.content })
  }

  async logout() {
    const response = await client.post('/users/logout/')

    if (response.status !== 200) {
      return
    }

    this.setState({ session: null })
  }

  render() {
    return this.state.session ? (
      <Main session={this.state.session} onLogout={() => this.logout()} />
    ) : (
      <Login
        session={this.state.session}
        errors={this.state.errors}
        onSubmit={data => this.login(data)}
      />
    )
  }
}
