import React from 'react'

export default props => (
  <button onClick={() => props.onLogout && props.onLogout()}>Logout</button>
)
