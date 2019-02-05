import React, { Component } from 'react'

export default ({ client }) => class ProjectSelect extends Component {
  constructor(props) {
    super(props)

    this.state = {
      projects: []
    }

    this.onChange = this.onChange.bind(this)
  }

  async componentDidMount() {
    let projects = await client.get('/projects/')
    projects = projects.content

    this.setState({
      projects,
      filteredProjects: projects,
      value: this.props.value ? this.props.value._id : ''
    })
  }

  componentWillReceiveProps(nextProps) {
    const newState = {}

    if (nextProps.exclude) {
      newState.filteredProjects = this.state.projects.filter(
        ({ _id }) => !nextProps.exclude.includes(_id)
      )
    }

    newState.value = nextProps.value
    this.setState(newState)
  }

  onChange(e) {
    const project = this.state.filteredProjects.find(({ _id }) => e.target.value === _id)

    if (!project) {
      return
    }

    this.props.onChange && this.props.onChange(project)
  }

  render() {
    if (!this.state.filteredProjects || !this.state.filteredProjects.length) {
      return null
    }

    return (
      <label htmlFor={this.props.id} className={this.props.error ? ' error' : ''}>
        {this.props.label ? (
          <span>{this.props.label}</span>
        ) : null}
        {this.props.error ? (
          <p>{this.props.error}</p>
        ) : null}
        <select
          id={this.props.id || null}
          value={this.state.value && this.state.value._id ? this.state.value._id : ''}
          onChange={this.onChange}
          required={this.props.required}
        >
          {!this.state.value || !this.state.value._id ? (
            <option value="">{this.props.emptyLabel || '–'}</option>
          ) : null}
          {this.state.filteredProjects.map(project => (
            <option key={project._id} value={project._id}>{project.name}</option>
          ))}
        </select>
      </label>
    )
  }
}
