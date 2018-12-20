import React from 'react'
import { BrowserRouter as Router, Link, Route } from 'react-router-dom'
import Calendar from './pages/Calendar'

export default props => (
  <Router>
    <div className="p-Main">
      <header className="p-Main-header">
        <nav>
          <Link to="/">Calendar</Link>
          <button onClick={() => props.onLogout && props.onLogout()}>Logout</button>
        </nav>
      </header>
      <main className="p-Main-main">
        <Route path="/" exact component={Calendar} />
      </main>
    </div>
  </Router>
)
