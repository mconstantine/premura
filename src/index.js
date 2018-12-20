import React from 'react'
import ReactDOM from 'react-dom'
import './index.scss'
import * as serviceWorker from './serviceWorker'

import client from './libs/client'

import makeApp, { PremuraContext } from './make-App.jsx'
import makeLogin from './make-Login'
import makeMain from './make-Main'
import makeCalendar from './pages/make-Calendar'

const Login = makeLogin({ PremuraContext })
const Calendar = makeCalendar({ client })
const Main = makeMain({ Calendar })
const App = makeApp({ client, Login, Main })

ReactDOM.render(<App />, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister()
