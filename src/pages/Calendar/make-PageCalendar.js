import printf from 'printf'
import React, { Component } from 'react'
import { PremuraContext } from '../../make-App'
import Calendar from 'react-calendar'
import iconArrowLeft from './icon-arrow-left.svg'
import iconArrowRight from './icon-arrow-right.svg'
import iconCalendar from './icon-calendar.svg'
import iconPeople from './icon-people.svg'
import './PageCalendar.scss'

/*
Tests:

should go to previous week (get activities)
should go to next week (get activities)
should get current user's activities on instantiation
should switch user (get activities)
should go to date (get activities)
*/

export default ({ client }) => class PageCalendar extends Component {
  static contextType = PremuraContext

  constructor(props) {
    super(props)

    this.state = {
      users: [],
      currentUser: null,
      currentDate: new Date(),
      from: null,
      to: null,
      activities: [],
      shouldShowCalendar: false
    }

    this.elRootRef = React.createRef()

    this.prevWeek = this.prevWeek.bind(this)
    this.nextWeek = this.nextWeek.bind(this)
    this.onCurrentUserChange = this.onCurrentUserChange.bind(this)
    this.showCalendar = this.showCalendar.bind(this)
    this.hideCalendar = this.hideCalendar.bind(this)
    this.toggleCalendar = this.toggleCalendar.bind(this)
    this.goToDate = this.goToDate.bind(this)
  }

  async componentDidMount() {
    const [from, to] = this.getWeekBounds(this.state.currentDate)
    const activities = await this.getActivities(this.context.session._id, from, to)
    const users = await client.get('/users/')

    this.setState({
      users: users.content,
      currentUser: this.context.session,
      from,
      to,
      activities: activities.content
    })

    this.elRootRef.current.addEventListener('click',
      e => this.state.shouldShowCalendar &&
        !Array.from(e.target.classList).find(
          className => className.substring(0, 14) === 'react-calendar'
        ) &&
        this.hideCalendar()
    )
  }

  getActivities(userId, from, to) {
    return client.get(`/activities/` +
    `?people[]=${userId}&before=${to.toISOString()}&after=${from.toISOString()}`)
  }

  getWeekBounds(date) {
    const monday = new Date(Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() - date.getDay() + 1
    ))

    const sunday = new Date(monday.getTime() + 1000 * 60 * 60 * 24 * 7)

    return [monday, sunday]
  }

  async onCurrentUserChange(e) {
    const user = this.state.users.find(({ _id }) => e.target.value === _id)

    if (!user) {
      return
    }

    const activities = await this.getActivities(user._id, this.state.from, this.state.to)

    this.setState({
      currentUser: user,
      activities: activities.content
    })
  }

  async prevWeek() {
    const from = new Date(this.state.from.getTime() - 1000 * 60 * 60 * 24 * 7)
    const to = new Date(this.state.to.getTime() - 1000 * 60 * 60 * 24 * 7)
    const activities = await this.getActivities(this.state.currentUser._id, from, to)

    this.setState({
      from,
      to,
      activities: activities.content
    })
  }

  async nextWeek() {
    const from = new Date(this.state.from.getTime() + 1000 * 60 * 60 * 24 * 7)
    const to = new Date(this.state.to.getTime() + 1000 * 60 * 60 * 24 * 7)
    const activities = await this.getActivities(this.state.currentUser._id, from, to)

    this.setState({
      from,
      to,
      activities: activities.content
    })
  }

  showCalendar() {
    this.setState({ shouldShowCalendar: true })
  }

  hideCalendar() {
    this.setState({ shouldShowCalendar: false })
  }

  toggleCalendar() {
    this.setState({ shouldShowCalendar: !this.state.shouldShowCalendar })
  }

  async goToDate(date) {
    const [from, to] = this.getWeekBounds(date)
    const activities = await this.getActivities(this.state.currentUser._id, from, to)

    this.setState({
      currentDate: date,
      from,
      to,
      activities: activities.content
    })
  }

  render() {
    const gt = this.context.gt
    let headerTitle = ''

    if (this.state.from && this.state.to) {
      const january1st = new Date(this.state.from.getFullYear(), 0, 1)
      const weekNumber = Math.ceil((this.state.from - january1st) / (1000 * 60 * 60 * 24 * 7)) + 1

      headerTitle = printf(
        gt.gettext('Week %s'),
        printf(
          gt.gettext('%i (%s – %s)'),
          weekNumber,
          this.state.from.toLocaleString(this.context.session.lang, {
            month: 'long',
            day: 'numeric'
          }),
          this.state.to.toLocaleString(this.context.session.lang, {
            month: 'long',
            day: 'numeric'
          })
        )
      )
    }

    const usersSelect = this.state.currentUser && this.state.users.length ? (
      <select value={this.state.currentUser._id} onChange={this.onCurrentUserChange}>
        {this.state.users.map(user => (
          <option key={user._id} value={user._id}>{user.name}</option>
        ))}
      </select>
    ) : null

    let table

    if (this.state.from && this.state.to) {
      // This creates an empty space instead of the day name
      const times = [(
        <div key="0" />
      )]

      for (let i = 0; i < 24; i++) {
        const date = new Date(this.state.from)
        date.setHours(i)

        times.push((
          <div key={date.getTime()}>
            {date.toLocaleString(this.context.session.lang, {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        ))
      }

      table = [(
        <div key="hours" className="p-PageCalendar-column hours">
          {times}
        </div>
      )]

      for (let i = 0; i < 7; i++) {
        const date = new Date(this.state.from.getTime() + 1000 * 60 * 60 * 24 * i)
        let dayName = date.toLocaleString(this.context.session.lang, { weekday: 'long' })
        dayName = dayName.substring(0, 1).toUpperCase() + dayName.substring(1)

        table.push((
          <div key={i} className="p-PageCalendar-column">
            <div>{dayName}</div>
            {/* TODO: put activities here */}
          </div>
        ))
      }
    }

    return (
      <div className="p-PageCalendar" ref={this.elRootRef}>
        <header className="p-PageCalendar-header">
          <div>
            <img src={iconArrowLeft} alt="Previous" onClick={this.prevWeek} />
            <img src={iconArrowRight} alt="Next" onClick={this.nextWeek} />
            <p>{headerTitle}</p>
          </div>
          <div>
            <img src={iconCalendar} alt="Go to date" onClick={this.toggleCalendar} />
            <Calendar
              minDetail="year"
              className={
                'p-PageCalendar-calendar ' + (this.state.shouldShowCalendar ? 'shown' : 'hidden')
              }
              value={this.state.currentDate}
              onChange={this.goToDate}
            />
            {usersSelect}
            <img src={iconPeople} alt="People"/>
          </div>
        </header>
        <main className="p-PageCalendar-main">
          {table}
        </main>
      </div>
    )
  }
}
