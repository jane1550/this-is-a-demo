/**
 * Created by haydn.chen on 3/20/2018.
 */
import React from 'react'
import PropTypes from 'prop-types'
import FormField from './FormField'
import {guid, getLabelByValue} from '../../common/utils'

export default class FormSelect extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    label: PropTypes.string,
    options: PropTypes.array,
    blankOption: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    onClick: PropTypes.func,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    readOnly: PropTypes.bool,
    hidden: PropTypes.bool,
    multiple: PropTypes.bool,
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
    options: [],
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
      disabled,
      readOnly,
      hidden,
      options,
      blankOption,
      multiple,
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
            {getLabelByValue(options, value)}
          </pre>
        </FormField>
      )
    }
    let optionElements = [];
    if (blankOption) {
      optionElements.push(<option key={id + '-option_'} value="" disabled={readOnly}>{blankOption}</option>)
    }
    if (options && options.length > 0) {
      options.map((option, index) => {
        if (option && typeof (option.value) !== "undefined") {
          optionElements.push(<option key={id + '-option_' + index} value={option.value}
                                      disabled={readOnly}>{option.label}</option>)
        } else {
          optionElements.push(<option key={id + '-option_' + index} value={option}
                                      disabled={readOnly}>{option}</option>)
        }
      })
    }
    return (
      <FormField id={id} label={label} required={required} hidden={hidden} inline={inline} colSize={colSize}
                 tooltip={tooltip} className={className} style={style}>
        <select className={inputClass} id={id} value={value}
                disabled={disabled} readOnly={readOnly}
                onChange={e => this.onChange(e.target.value)}
                onBlur={e => this.onBlur(e.target.value)}
                onFocus={e => this.onFocus(e)} onClick={e => this.onClick(e)} required={required}
                multiple={multiple} style={inputStyle}>
          {optionElements}
        </select>
        <div className="invalid-feedback">
          {invalidFeedback}
        </div>
      </FormField>
    )
  }
}
