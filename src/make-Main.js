import React from 'react'
import { BrowserRouter as Router, Link, Route } from 'react-router-dom'
import './make-Main.scss'

export default ({ PageCalendar }) => props => (
  <Router>
    <div className="p-Main">
      <header className="p-Main-header">
        <nav>
          <ul>
            <li>
              <Link to="/">Calendar</Link>
            </li>
          </ul>
          <ul>
            <li>
              <button onClick={() => props.onLogout && props.onLogout()}>Logout</button>
            </li>
          </ul>
        </nav>
      </header>
      <main className="p-Main-main">
        <Route path="/" exact>
          <PageCalendar session={props.session} />
        </Route>
      </main>
    </div>
  </Router>
)
