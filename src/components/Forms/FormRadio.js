/**
 * Created by haydn.chen on 3/20/2018.
 */
import React from 'react'
import PropTypes from 'prop-types'
import FormField from './FormField'
import {guid, getLabelByValue} from '../../common/utils'

export default class FormRadio extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    label: PropTypes.string,
    options: PropTypes.array,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    onClick: PropTypes.func,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    readOnly: PropTypes.bool,
    hidden: PropTypes.bool,
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
    align: PropTypes.oneOf([
      "horizontal",
      "vertical",
    ]),
    children: PropTypes.node,
    className: PropTypes.string,
    style: PropTypes.object,
  }

  static defaultProps = {
    required: false,
    disabled: false,
    readOnly: false,
    hidden: false,
    options: [],
    invalidFeedback: 'This field is required.',
    align: 'horizontal',
    inputSize: "default",
  }

  constructor(props) {
    super(props)
    this.id = this.props.id || guid()
    this.state = {
      value: this.props.value,
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

  onChange(checked, value) {
    const {disabled, readOnly, onChange} = this.props
    if (disabled || readOnly) {
      return
    }
    if (checked) {
      this.setState({value}, () => {
        this.value = this.state.value // for ref.value
        onChange && onChange(this.state.value)
      })
    }
  }

  onBlur(checked, value) {
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
      disabled,
      readOnly,
      hidden,
      options,
      invalidFeedback,
      inline,
      colSize,
      viewMode,
      invalid,
      tooltip,
      inputClassName,
      inputStyle,
      inputSize,
      align,
      children,
      className,
      style,
    } = this.props
    const id = this.id
    let textClass = "w-100 col-form-label pre-wrap"
    if (viewMode) {
      return (
        <FormField id={id} label={label} required={required} hidden={hidden} inline={inline} colSize={colSize}
                   tooltip={tooltip} className={className} style={style}>
          <pre id={id} className={textClass}>
            {getLabelByValue(options, this.state.value)}
          </pre>
          {children}
        </FormField>
      )
    }
    let optionElements = [];
    let inputRequired = (!this.state.value || this.state.value.length <= 0) && required
    if (options && options.length > 0) {
      let inputClass = "custom-control-input"
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
      options.map((option, index) => {
        if (option && typeof (option.value) !== "undefined") {
          let checked = this.state.value == option.value
          optionElements.push(
            <div key={id + '_' + index} className="custom-control custom-radio m-2">
              <input type="radio" id={id + '_' + index} name={id} className={inputClass}
                     value={option.value} checked={checked}
                     onChange={e => this.onChange(e.target.checked, option.value)}
                     onBlur={e => this.onBlur(e.target.checked, option.value)} onFocus={e => this.onFocus(e)}
                     onClick={e => this.onClick(e)}
                     disabled={disabled} readOnly={readOnly} required={inputRequired} style={inputStyle}/>
              <label className={"custom-control-label" + (checked ? " border-bottom border-primary" : "")}
                     htmlFor={id + '_' + index}>{option.label}</label>
              {index === options.length - 1 &&
              <div className="invalid-feedback">
                {invalidFeedback}
              </div>
              }
            </div>
          )
        } else {
          let checked = this.state.value == option
          optionElements.push(
            <div key={id + '_' + index} className="custom-control custom-radio m-2">
              <input type="radio" id={id + '_' + index} name={id} className={inputClass} value={option}
                     checked={checked} onChange={e => this.onChange(e.target.checked, option)}
                     onBlur={e => this.onBlur(e.target.checked, option)} onFocus={e => this.onFocus(e)}
                     disabled={disabled}
                     readOnly={readOnly} required={inputRequired} style={inputStyle}/>
              <label className={"custom-control-label" + (checked ? " border-bottom border-primary" : "")}
                     htmlFor={id + '_' + index}>{option}</label>
              {index === options.length - 1 &&
              <div className="invalid-feedback">
                {invalidFeedback}
              </div>
              }
            </div>
          )
        }
      })
    }
    let containerClass = "d-flex flex-wrap"
    if (align === "vertical") {
      containerClass += " flex-column"
    }
    return (
      <FormField id={id} label={label} required={required} hidden={hidden} inline={inline} colSize={colSize}
                 tooltip={tooltip} className={className} style={style}>
        <div id={id} className={containerClass}>
          {optionElements}
          {children}
        </div>
      </FormField>
    )
  }
}
