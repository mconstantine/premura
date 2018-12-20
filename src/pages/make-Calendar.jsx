import React, { Component } from 'react'
import { PremuraContext } from '../make-App'

export default ({ client }) => class Calendar extends Component {
  static contextType = PremuraContext

  constructor(props) {
    super(props)

    this.state = {
      users: [],
      date: new Date()
    }
  }

  componentDidMount() {
    // TODO: get current user's activities, get users list
  }

  render() {
    return (
      <div className="p-Calendar">

      </div>
    )
  }
}
