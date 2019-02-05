import printf from 'printf'
import React, { Component } from 'react'
import { PremuraContext } from '../../make-App'
import locales from '../../Common/momentLocales'
import iconCalendar from '../../Common/icon-calendar.svg'
import iconArrowLeft from './icon-arrow-left.svg'
import iconArrowRight from './icon-arrow-right.svg'
import iconPeople from './icon-people.svg'
import './make-PageCalendar.scss'

/*
Tests:

should go to previous week (get activities)
should go to next week (get activities)
should get current user's activities on instantiation
should switch user (get activities)
should go to date (get activities)
should show activities into the table
should turn activities duration into rowSpan
*/

export default ({
  client, ReactDateTime, UserSelect, CalendarTable, EditActivityPopup
}) => class PageCalendar extends Component {
  static contextType = PremuraContext

  constructor(props) {
    super(props)

    this.state = {
      currentUser: null,
      currentDate: new Date(),
      from: null,
      to: null,
      activities: [],
      shouldShowCalendar: false,
      shouldShowEditingActivityPopup: false,
      currentEditingActivity: null
    }

    this.elRootRef = React.createRef()

    this.prevWeek = this.prevWeek.bind(this)
    this.nextWeek = this.nextWeek.bind(this)
    this.onCurrentUserChange = this.onCurrentUserChange.bind(this)
    this.showCalendar = this.showCalendar.bind(this)
    this.hideCalendar = this.hideCalendar.bind(this)
    this.toggleCalendar = this.toggleCalendar.bind(this)
    this.goToDate = this.goToDate.bind(this)
    this.createActivity = this.createActivity.bind(this)
    this.editActivity = this.editActivity.bind(this)
    this.onCloseEditingActivityPopup = this.onCloseEditingActivityPopup.bind(this)
  }

  async componentDidMount() {
    const [from, to] = this.getWeekBounds(this.state.currentDate)
    const activities = await this.getActivities(this.context.session._id, from, to)

    this.setState({
      currentUser: this.context.session,
      from,
      to,
      activities: activities.content
    })

    this.elRootRef.current.addEventListener('click',
      e => this.state.shouldShowCalendar &&
        !Array.from(e.target.classList).find(
          className => className === 'p-Calendar-trigger'
        ) &&
        !Array.from(e.target.classList).find(
          className => className.substring(0, 3) === 'rdt'
        ) &&
        !Array.from(e.target.parentNode.classList).find(
          className => className.substring(0, 3) === 'rdt'
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

  async onCurrentUserChange(user) {
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
    date = new Date(date)

    const [from, to] = this.getWeekBounds(date)
    const activities = await this.getActivities(this.state.currentUser._id, from, to)

    this.setState({
      currentDate: date,
      from,
      to,
      activities: activities.content,
      shouldShowCalendar: false
    })
  }

  createActivity(timeFrom) {
    this.setState({
      currentEditingActivity: { timeFrom },
      shouldShowEditingActivityPopup: true
    })
  }

  async editActivity(activity) {
    activity = await client.get(`/activities/${activity._id}/`)

    this.setState({
      currentEditingActivity: activity.content,
      shouldShowEditingActivityPopup: true
    })
  }

  onCloseEditingActivityPopup() {
    this.setState({
      shouldShowEditingActivityPopup: false
    })
  }

  setActivity(activity) {
    // TODO: find activity by ID, add or override
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

    return (
      <div className="p-PageCalendar" ref={this.elRootRef}>
        <header className="p-PageCalendar-header">
          <div>
            <img src={iconArrowLeft} alt="Previous" onClick={this.prevWeek} />
            <img src={iconArrowRight} alt="Next" onClick={this.nextWeek} />
            <p>{headerTitle}</p>
          </div>
          <div>
            <img
              className="p-Calendar-trigger"
              src={iconCalendar}
              alt="Go to date"
              onClick={this.toggleCalendar}
            />
            <ReactDateTime
              timeFormat={false}
              input={false}
              className={
                'p-Calendar p-PageCalendar-calendar ' +
                (this.state.shouldShowCalendar ? 'shown' : 'hidden')
              }
              locale={locales[this.context.session.lang]}
              value={this.state.currentDate}
              onChange={this.goToDate}
            />
            <UserSelect
              value={this.state.currentUser}
              onChange={this.onCurrentUserChange}
            />
            <img src={iconPeople} alt="People"/>
          </div>
        </header>
        <main className="p-PageCalendar-main">
          {
            this.state.from && this.state.to ? (
              <CalendarTable
                className="p-PageCalendar-main-table"
                from={this.state.from}
                activities={this.state.activities}
                lang={this.context.session.lang}
                onCreateActivity={this.createActivity}
                onEditActivity={this.editActivity}
              />
            ) : null
          }
        </main>
        <EditActivityPopup
          visible={this.state.shouldShowEditingActivityPopup}
          activity={this.state.currentEditingActivity}
          onClose={this.onCloseEditingActivityPopup}
        />
      </div>
    )
  }
}
