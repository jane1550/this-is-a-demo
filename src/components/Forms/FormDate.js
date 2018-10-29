/**
 * Created by haydn.chen on 3/20/2018.
 */
import React from 'react'
import PropTypes from 'prop-types'
import FormField from './FormField'
import Datetime from 'react-datetime'
import {guid, formatDate} from '../../common/utils'

export default class FormDate extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    label: PropTypes.node,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    placeholder: PropTypes.string,
    required: PropTypes.bool,
    minDate: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    maxDate: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    disabled: PropTypes.bool,
    readOnly: PropTypes.bool,
    hidden: PropTypes.bool,
    dateFormat: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    timeFormat: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    locale: PropTypes.string,
    invalidFeedback: PropTypes.node,
    inline: PropTypes.bool,
    colSize: PropTypes.oneOf([
      "small",
      "middle",
      "large",
      "full",
    ]),
    viewMode: PropTypes.bool,
    invalid: PropTypes.bool,
    tooltip: PropTypes.string,
    inputClassName: PropTypes.string,
    inputStyle: PropTypes.object,
    inputSize: PropTypes.oneOf([
      "default",
      "small",
      "large",
    ]),
    className: PropTypes.string,
    style: PropTypes.object,
  }

  static defaultProps = {
    required: false,
    disabled: false,
    readOnly: false,
    hidden: false,
    placeholder: 'YYYY-MM-DD',
    dateFormat: 'YYYY-MM-DD',
    timeFormat: false,
    locale: 'en',
    invalidFeedback: 'This field is required.',
    inputSize: "default",
  }

  constructor(props) {
    super(props)
    this.id = this.props.id || guid()
    this.state = {
      value: this.props.value
    }
    this.value = this.state.value // for ref.value
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value === this.props.value) {
      return
    }
    this.setState({value: nextProps.value}, () => {
      this.value = this.state.value // for ref.value
    })
  }

  valid(current) {
    let date = Datetime.moment(current)
    if (!date.isValid()) {
      return false
    }
    const {minDate, maxDate} = this.props
    if (minDate && maxDate) {
      return date.isAfter(Datetime.moment(minDate).add(-1, 'days')) && date.isBefore(Datetime.moment(maxDate))
    } else if (minDate) {
      return date.isAfter(Datetime.moment(minDate).add(-1, 'days'))
    } else if (maxDate) {
      return date.isBefore(Datetime.moment(maxDate))
    }
    return true
  }

  renderInput() {
    const {readOnly, disabled, invalidFeedback} = this.props
    if (readOnly || disabled) {
      return (props, openCalendar, closeCalendar) => (
        <div className="input-group">
          <input {...props} onChange={null} onFocus={null} onClick={null} type="tel"/>
          <div className="input-group-append"><span className="input-group-text"><i className="fas fa-calendar"/></span>
          </div>
          <div className="invalid-feedback">
            {invalidFeedback}
          </div>
        </div>
      )
    } else {
      return (props, openCalendar, closeCalendar) => (
        <div className="input-group">
          <input {...props} onKeyDown={e => e.preventDefault()} type="tel"
                 onChange={e => this.onInputChange(props, e)}/>
          <div className="input-group-append">
            <span className="input-group-text"><i className="fas fa-calendar" onClick={openCalendar}/></span>
          </div>
          <div className="invalid-feedback">
            {invalidFeedback}
          </div>
        </div>
      )
    }
  }

  onInputChange(props, e) {
    if (this.valid(e.target.value)) {
      props.onChange && props.onChange(e)
    }
  }

  onChange(value) {
    const {onChange} = this.props
    this.setState({value}, () => {
      this.value = this.state.value // for ref.value
      onChange && onChange(this.state.value)
    })
  }

  onBlur(value) {
    const {onBlur} = this.props
    onBlur && onBlur(this.state.value)
  }

  onFocus(e) {
    const {onFocus} = this.props
    onFocus && onFocus(e)
  }

  render() {
    const {
      label,
      required,
      value,
      placeholder,
      disabled,
      readOnly,
      hidden,
      locale,
      dateFormat,
      timeFormat,
      inline,
      colSize,
      viewMode,
      invalid,
      tooltip,
      inputClassName,
      inputStyle,
      inputSize,
      className,
      style,
    } = this.props
    const id = this.id
    let inputClass = "form-control"
    if (inputSize === "small") {
      inputClass += " form-control-sm"
    } else if (inputSize === "large") {
      inputClass += " form-control-lg"
    }
    if (invalid) {
      inputClass += " is-invalid"
    }
    if (inputClassName) {
      inputClass += " " + inputClassName
    }
    let textClass = "w-100 col-form-label pre-wrap"
    let noFormat = false
    let finalDatetimeFormat
    if (typeof dateFormat !== "boolean") {
      finalDatetimeFormat = dateFormat
      if (typeof timeFormat !== "boolean") {
        finalDatetimeFormat += " " + timeFormat
      } else if (timeFormat === true) {
        finalDatetimeFormat += " " + "h:mm A"
      }
    } else if (dateFormat === true) {
      finalDatetimeFormat = 'YYYY-MM-DD'
      if (typeof timeFormat !== "boolean") {
        finalDatetimeFormat += " " + timeFormat
      } else if (timeFormat === true) {
        finalDatetimeFormat += " " + "h:mm A"
      }
    } else {
      if (typeof timeFormat !== "boolean") {
        finalDatetimeFormat = timeFormat
      } else if (timeFormat === true) {
        finalDatetimeFormat = "h:mm A"
      } else {
        noFormat = true
      }
    }
    if (viewMode) {
      return (
        <FormField id={id} label={label} required={required} hidden={hidden} inline={inline} colSize={colSize}
                   tooltip={tooltip} className={className} style={style}>
          <pre id={id} className={textClass}>
            {noFormat ? value : formatDate(value, finalDatetimeFormat)}
          </pre>
        </FormField>
      )
    }
    return (
      <FormField id={id} label={label} required={required} hidden={hidden} inline={inline} colSize={colSize}
                 tooltip={tooltip} className={className} style={style}>
        <Datetime
          isValidDate={current => this.valid(current)} locale={locale} dateFormat={dateFormat} timeFormat={timeFormat}
          inputProps={{id, placeholder, disabled, readOnly, className: inputClass, required, style: inputStyle}}
          value={value}
          onChange={date => this.onChange(date)}
          onBlur={date => this.onBlur(date)}
          onFocus={e => this.onFocus(e)}
          renderInput={this.renderInput()} closeOnSelect={true}
        />
      </FormField>
    )
  }
}
