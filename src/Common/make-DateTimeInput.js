import React, { Component } from 'react'
import './make-DateTimeInput.scss'
import locales from './momentLocales'

export default ({ ReactDateTime }) => class DateTimeInput extends Component {
  constructor(props) {
    super(props)

    this.state = {
      value: new Date(props.value)
    }

    this.onChange = this.onChange.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.value) {
      return
    }

    if (this.state.value && this.state.value.getTime() === new Date(nextProps.value).getTime()) {
      return
    }

    this.setState({
      value: new Date(nextProps.value)
    })
  }

  onChange(value) {
    value = new Date(value)

    this.setState({
      value
    })

    this.props.onChange && this.props.onChange(value)
  }

  render() {
    return (
      <div
        className={'p-DateTimeInput' + (this.props.error ? ' error' : '')}
      >
        <label>
          {this.props.label ? (
            <span>{this.props.label}</span>
          ) : null}
          {this.props.error ? (
            <p>{this.props.error}</p>
          ) : null}
          <ReactDateTime
            className="p-Calendar"
            input={false}
            timeConstraints={{ minutes: { step: 60 } }}
            value={this.state.value}
            onChange={this.onChange}
            locale={locales[this.props.lang]}
            viewMode={this.props.viewMode}
          />
        </label>
      </div>
    )
  }
}
