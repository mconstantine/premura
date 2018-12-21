import React from 'react'
import ReactDOM from 'react-dom'
import './index.scss'
import * as serviceWorker from './serviceWorker'

import client from './libs/client'

import makeApp, { PremuraContext } from './make-App'
import makeLogin from './make-Login'
import makeMain from './make-Main'
import makePageCalendar from './pages/make-PageCalendar'

const Login = makeLogin({ PremuraContext })
const PageCalendar = makePageCalendar({ client })
const Main = makeMain({ PageCalendar })
const App = makeApp({ client, Login, Main })

ReactDOM.render(<App />, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister()
