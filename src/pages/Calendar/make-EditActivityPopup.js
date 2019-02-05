import React, { Component } from 'react'

export default ({
  client, PremuraContext, Textarea, DeleteButton, ProjectSelect, UserSelect, DateTimeInput, Repeater, trim
}) => class EditActivityPopup extends Component {
  static contextType = PremuraContext

  constructor(props) {
    super(props)
    this.state = Object.assign({}, this.getEmptyActivity(), { errors: [] })

    this.onBackdropClick = this.onBackdropClick.bind(this)
    this.onTitleChange = this.onTitleChange.bind(this)
    this.onDescriptionChange = this.onDescriptionChange.bind(this)
    this.onProjectChange = this.onProjectChange.bind(this)
    this.onRecipientChange = this.onRecipientChange.bind(this)
    this.onTimeFromChange = this.onTimeFromChange.bind(this)
    this.onTimeToChange = this.onTimeToChange.bind(this)
    this.save = this.save.bind(this)
    this.delete = this.delete.bind(this)
    this.addPerson = this.addPerson.bind(this)
    this.removePerson = this.removePerson.bind(this)
    this.reset = this.reset.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.visible) {
      return this.setState(this.getEmptyActivity())
    }

    const activity = Object.assign({}, this.getEmptyActivity(), nextProps.activity)

    activity.timeFrom = new Date(activity.timeFrom)
    activity.timeTo = activity.timeTo ?
      new Date(activity.timeTo) :
      new Date(activity.timeFrom.getTime() + 1000 * 60 * 60)

    this.originalActivity = activity

    this.setState(Object.assign(activity, {
      errors: []
    }))
  }

  getEmptyActivity() {
    return {
      _id: null,
      title: '',
      description: '',
      project: {},
      recipient: {},
      timeFrom: new Date().toISOString(),
      timeTo: null,
      people: []
    }
  }

  onBackdropClick(e) {
    if (e.target.classList.contains('p-Dialog')) {
      this.close()
    }
  }

  close() {
    this.props.onClose && this.props.onClose()
  }

  onTitleChange(e) {
    const title = e.target.value
    const newState = { title }

    if (!trim(title)) {
      newState.errors = Object.assign(this.state.errors, {
        title: this.context.gt.gettext('Title is required')
      })
    } else {
      newState.errors = this.state.errors
      delete newState.errors.title
    }

    this.setState(newState)
  }

  onDescriptionChange(e) {
    this.setState({
      description: e.target.value
    })
  }

  onProjectChange(project) {
    this.setState({
      project
    })
  }

  onRecipientChange(recipient) {
    this.setState({
      recipient
    })
  }

  onTimeFromChange(timeFrom) {
    this.setState({
      timeFrom
    }, () => this.checkTimes())
  }

  onTimeToChange(timeTo) {
    this.setState({
      timeTo
    }, () => this.checkTimes())
  }

  checkTimes() {
    if (this.state.timeFrom >= this.state.timeTo) {
      this.setState({
        errors: Object.assign(this.state.errors, {
          timeTo: this.context.gt.gettext('"To" should be later than "From"')
        })
      })
    } else {
      const errors = this.state.errors
      delete errors.timeTo
      this.setState({ errors })
    }
  }

  async save(e) {
    e && e.preventDefault && e.preventDefault()

    const errors = this.state.errors
    delete errors.server
    this.setState({ errors })

    const update = {}

    if (this.state.title !== this.originalActivity.title) {
      update.title = trim(this.state.title)
    }

    if (this.state.description !== this.originalActivity.description) {
      update.description = trim(this.state.description)
    }

    if (this.state.project._id !== this.originalActivity.project._id) {
      update.project = this.state.project._id
    }

    if (this.state.recipient._id !== this.originalActivity.recipient._id) {
      update.recipient = this.state.recipient._id
    }

    if (!this.state._id || this.state.timeFrom.getTime() !== this.originalActivity.timeFrom.getTime()) {
      update.timeFrom = this.state.timeFrom.toISOString()
    }

    if (!this.state._id || this.state.timeTo.getTime() !== this.originalActivity.timeTo.getTime()) {
      update.timeTo = this.state.timeTo.toISOString()
    }

    if (!Object.keys(update).length) {
      return
    }

    const method = this.state._id ? 'put' : 'post'
    const url = '/activities/' + (this.state._id ? `${this.state._id}/` : '')
    const response = await client[method](url, update)

    if (response.status === 200 || response.status === 201) {
      response.content.timeFrom = new Date(response.content.timeFrom || this.state.timeFrom)
      response.content.timeTo = new Date(response.content.timeTo || this.state.timeTo)

      this.setState(response.content, () => {
        this.originalActivity = this.state
      })
    } else if (response.content.errors) {
      this.setState({
        errors: {
          server: response.content.errors.map(error => error.msg)
        }
      })
    }
  }

  async delete() {
    const errors = this.state.errors
    delete errors.server
    this.setState({ errors })

    const response = await client.delete(`/activities/${this.state._id}/`)

    if (response.status !== 200) {
      if (response.content.errors) {
        this.setState({
          errors: {
            server: response.content.errors.map(error => error.msg).join('<br>')
          }
        })
      }

      return
    }

    this.close()
  }

  async addPerson(person) {
    this.setState({
      people: this.state.people.concat([person])
    }, async () => {
      const response = await client.post(`/activities/${this.state._id}/people/`, {
        people: [person._id]
      })

      if (response.status !== 200) {
        const people = this.state.people
        people.pop()
        this.setState({ people })

        if (response.content.errors) {
          this.setState({
            errors: Object.assign(this.state.errors, {
              people: response.content.errors.map(error => error.msg).join('<br>')
            })
          })
        }
      }
    })
  }

  removePerson(person) {
    const index = this.state.people.findIndex(({ _id }) => _id !== person._id)

    this.setState({
      people: this.state.people.filter(({ _id }) => _id !== person._id)
    }, async () => {
      const response = await client.delete(`/activities/${this.state._id}/people/`, {
        people: [person._id]
      })

      if (response.status !== 200) {
        const people = this.state.people
        people.splice(index, 0, person)
        this.setState({ people })

        if (response.content.errors) {
          this.setState({
            errors: Object.assign(this.state.errors, {
              people: response.content.errors.map(error => error.msg).join('<br>')
            })
          })
        }
      }
    })
  }

  reset() {
    this.setState(this.originalActivity)
  }

  render() {
    const className = ['p-Dialog']
    const gt = this.context.gt

    if (this.props.visible) {
      className.push('visible')
    }

    return (
      <div className={className.join(' ')} onClick={this.onBackdropClick}>
        <div>
          <button onClick={() => this.close()}>&times;</button>
          <div>
            <form onSubmit={this.save}>
              <label htmlFor="title" className={this.state.errors.title ? 'error' : ''}>
                <span>{gt.gettext('Title:')}</span>
                <input
                  id="title"
                  type="text"
                  value={this.state.title}
                  onChange={this.onTitleChange}
                  required
                />
                {this.state.errors.title ? (
                  <p>{this.state.errors.title}</p>
                ) : null}
              </label>
              <Textarea
                id="description"
                value={this.state.description}
                label={gt.gettext('Description:')}
                onChange={this.onDescriptionChange}
              />
              <ProjectSelect
                id="project"
                label={gt.gettext('Project:')}
                emptyLabel={gt.gettext('Set a project')}
                value={this.state.project}
                onChange={this.onProjectChange}
                required
              />
              <UserSelect
                id="recipient"
                label={gt.gettext('Recipient:')}
                emptyLabel={gt.gettext('Set a recipient')}
                value={this.state.recipient}
                onChange={this.onRecipientChange}
                exclude={this.state.people.map(({ _id }) => _id)}
                error={this.state.errors.recipient}
                required
              />
              <DateTimeInput
                id="timeFrom"
                label={gt.gettext('From:')}
                value={this.state.timeFrom}
                onChange={this.onTimeFromChange}
                error={this.state.errors.timeFrom}
                viewMode="time"
              />
              <DateTimeInput
                id="timeTo"
                label={gt.gettext('To:')}
                value={this.state.timeTo}
                onChange={this.onTimeToChange}
                error={this.state.errors.timeTo}
                viewMode="time"
              />
              {this.state._id ? (
                <Repeater
                  label={gt.gettext('People:')}
                  items={this.state.people}
                  renderItem={item => item.name}
                  addItem={() => (
                    <UserSelect
                      emptyLabel={gt.gettext('Add a person')}
                      exclude={[this.state.recipient._id].concat(this.state.people.map(({ _id }) => _id))}
                      onChange={this.addPerson}
                    />
                  )}
                  removeItem={this.removePerson}
                  error={this.state.errors.people}
                />
              ) : null}
              <input
                type="submit"
                value={gt.gettext('Save')}
              />
              <input
                type="button"
                value={gt.gettext('Reset')}
                onClick={this.reset}
              />
              {this.state._id ? (
                <DeleteButton
                  label={gt.gettext('Delete')}
                  onClick={this.delete}
                />
              ) : null}
              <div className="p-errors">
                <ul>
                  {this.state.errors.server && this.state.errors.server.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }
}
