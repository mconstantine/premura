import React from 'react'
import ReactDOM from 'react-dom'
import './index.scss'
import * as serviceWorker from './serviceWorker'

import client from './libs/client'
import ReactDateTime from 'react-datetime'
import 'moment/locale/it'
import 'moment/locale/en-gb'

import trim from './libs/trim'

import makeApp, { PremuraContext } from './make-App'
import Textarea from './Common/Textarea'
import DeleteButton from './Common/DeleteButton'
import makeDateTimeInput from './Common/make-DateTimeInput'
import makeLogin from './pages/Login/make-Login'
import makeMain from './make-Main'
import makePageCalendar from './pages/Calendar/make-PageCalendar'
import makeUserSelect from './pages/Calendar/make-UserSelect'
import makeProjectSelect from './pages/Calendar/make-ProjectSelect'
import makeEditActivityPopup from './pages/Calendar/make-EditActivityPopup'

import CalendarTable from './pages/Calendar/CalendarTable'
import Repeater from './Common/Repeater'

const DateTimeInput = makeDateTimeInput({ ReactDateTime })
const Login = makeLogin({ PremuraContext })
const UserSelect = makeUserSelect({ client })
const ProjectSelect = makeProjectSelect({ client })

const EditActivityPopup = makeEditActivityPopup({
  client, PremuraContext, Textarea, DeleteButton, ProjectSelect, UserSelect, DateTimeInput, Repeater, trim
})

const PageCalendar = makePageCalendar({
  client, ReactDateTime, UserSelect, CalendarTable, EditActivityPopup
})

const Main = makeMain({ PageCalendar })
const App = makeApp({ client, Login, Main })

ReactDOM.render(<App />, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister()
