/**
 * Created by haydn.chen on 3/20/2018.
 */
import React from 'react'
import PropTypes from 'prop-types'
import FormField from './FormField'
import {guid} from '../../common/utils'

export default class FormTextarea extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    label: PropTypes.node,
    value: PropTypes.string,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    onClick: PropTypes.func,
    placeholder: PropTypes.string,
    required: PropTypes.bool,
    minLength: PropTypes.number,
    maxLength: PropTypes.number,
    disabled: PropTypes.bool,
    readOnly: PropTypes.bool,
    hidden: PropTypes.bool,
    rows: PropTypes.number,
    prefix: PropTypes.node,
    postfix: PropTypes.node,
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
    rows: 3,
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

  onClick(e) {
    const {onClick} = this.props
    onClick && onClick(e)
  }

  render() {
    const {
      label,
      required,
      value,
      placeholder,
      minLength,
      maxLength,
      disabled,
      readOnly,
      hidden,
      rows,
      prefix,
      postfix,
      invalidFeedback,
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
    if (viewMode) {
      return (
        <FormField id={id} label={label} required={required} hidden={hidden} inline={inline} colSize={colSize}
                   tooltip={tooltip} className={className} style={style}>
          <pre id={id} className={textClass}>
            {typeof prefix === "string" ? prefix : ''}{value}{typeof postfix === "string" ? postfix : ''}
          </pre>
        </FormField>
      )
    }
    return (
      <FormField id={id} label={label} required={required} hidden={hidden} inline={inline} colSize={colSize}
                 tooltip={tooltip} className={className} style={style}>
        <div className="input-group">
          {prefix && <div className="input-group-prepend">{typeof prefix === "string" ?
            <span className="input-group-text">{prefix}</span> : prefix}</div>}
          <textarea
            className={inputClass}
            id={id}
            value={value}
            placeholder={placeholder}
            minLength={minLength}
            maxLength={maxLength}
            disabled={disabled}
            readOnly={readOnly}
            onChange={e => this.onChange(e.target.value)}
            onBlur={e => this.onBlur(e.target.value)}
            onFocus={e => this.onFocus(e)}
            onClick={e => this.onClick(e)}
            required={required}
            rows={rows}
            style={inputStyle}
          />
          {postfix && <div className="input-group-append">{typeof postfix === "string" ?
            <span className="input-group-text">{postfix}</span> : postfix}</div>}
          <div className="invalid-feedback">
            {invalidFeedback}
          </div>
        </div>
      </FormField>
    )
  }
}
