import React, { Component } from 'react'
import Gettext from 'node-gettext'
import translationsIt from './languages/it.json'
import translationsEn from './languages/en.json'

export const PremuraContext = React.createContext()

export default ({ client, Login, Main }) => class App extends Component {
  constructor(props) {
    super(props)

    const gt = new Gettext()

    gt.addTranslations('it', 'premura', translationsIt)
    gt.addTranslations('en', 'premura', translationsEn)
    gt.setTextDomain('premura')
    gt.setLocale('it')

    this.state = {
      session: null,
      loginErrors: [],
      gt
    }
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
        this.setState({ loginErrors: response.content.errors.map(({ msg }) => msg) })
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
    return (
      <PremuraContext.Provider value={{ session: this.state.session, gt: this.state.gt }}>
      {
        this.state.session ? (
          <Main onLogout={() => this.logout()} />
        ) : (
          <Login
            errors={this.state.loginErrors}
            onSubmit={data => this.login(data)}
          />
        )
      }
      </PremuraContext.Provider>
    )
  }
}
