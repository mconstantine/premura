import printf from 'printf'
import React, { Component } from 'react'
import { PremuraContext } from '../../make-App'
import Calendar from 'react-calendar'
import CalendarTHead from './CalendarTHead'
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
should show activities inti the table
should turn activities duration into rowSpan
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

    let thead = null, tbody = []

    if (this.state.from && this.state.to) {
      thead = (<CalendarTHead from={this.state.from} lang={this.context.session.lang}></CalendarTHead>)

      const isSameDay = (d1, d2) =>
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate()
      const timezoneOffset = this.state.from.getTimezoneOffset() / 60

      for (let time = timezoneOffset; time < 24 + timezoneOffset; time++) {
        let tds = [(
          <td key={time}>{
            new Date(
              this.state.from.getTime() +
              1000 * 60 * 60 * time
            ).toLocaleString(this.context.session.lang, {
              hour: '2-digit',
              minute: '2-digit'
            })
          }</td>
        )]

        for (let day = 0; day < 7; day++) {
          // Start and end of the day
          const from = new Date(
            this.state.from.getTime() +
            1000 * 60 * 60 * 24 * day +
            1000 * 60 * 60 * time
          )
          const to = new Date(from.getTime() + 1000 * 60 * 60)

          const activities = this.state.activities
          .map(a => [a, new Date(a.timeFrom), new Date(a.timeTo)])
          .filter(([, timeFrom, timeTo]) => {
            // Filters today's activities
            return (isSameDay(timeFrom, from) || isSameDay(timeTo, to)) &&
              (timeFrom.getTime() <= from.getTime() && timeTo.getTime() >= to.getTime())
          })

          if (activities.length) {
            activities.forEach(([a, timeFrom, timeTo]) => {
              // Since we use rowSpan for activities that take more than one hour, we need
              // to print nothing if there is an activity for this hour but it started before
              const isStarting = timeFrom.getTime() === from.getTime()

              if (!isStarting) {
                return
              }

              const duration = Math.floor((timeTo.getTime() - timeFrom.getTime()) / (1000 * 60 * 60))

              tds.push(
                <td
                  key={time.toString() + day.toString()}
                  rowSpan={duration}
                  className="p-PageCalendar-main-table-cell"
                >{
                  <h4>{a.title}</h4>
                }</td>
              )
            })
          } else {
            // No activities for this hour
            tds.push(
              <td
                key={time.toString() + day.toString()}
                className="p-PageCalendar-main-table-placeholder"
              />
            )
          }
        }

        tbody.push(<tr key={time}>{tds}</tr>)
      }

      tbody = (<tbody>{tbody}</tbody>)
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
          <table className="p-PageCalendar-main-table">
            {thead}
            {tbody}
          </table>
        </main>
      </div>
    )
  }
}
