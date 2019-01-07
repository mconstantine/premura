import React from 'react'
import ReactDOM from 'react-dom'
import './index.scss'
import * as serviceWorker from './serviceWorker'

import client from './libs/client'
import Calendar from 'react-calendar'

import makeApp, { PremuraContext } from './make-App'
import makeLogin from './make-Login'
import makeMain from './make-Main'
import makePageCalendar from './pages/Calendar/make-PageCalendar'
import makeUserSelect from './pages/Calendar/make-UserSelect'

import CalendarTable from './pages/Calendar/CalendarTable'

const Login = makeLogin({ PremuraContext })
const UserSelect = makeUserSelect({ client })
const PageCalendar = makePageCalendar({ client, Calendar, UserSelect, CalendarTable })
const Main = makeMain({ PageCalendar })
const App = makeApp({ client, Login, Main })

ReactDOM.render(<App />, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister()
