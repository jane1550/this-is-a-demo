/**
 * Created by haydn.chen on 3/20/2018.
 */
import React from 'react'
import PropTypes from 'prop-types'
import numeral from 'numeral'
import FormField from './FormField'
import {guid} from '../../common/utils'

export default class FormNumber extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    label: PropTypes.node,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    onClick: PropTypes.func,
    placeholder: PropTypes.string,
    required: PropTypes.bool,
    pattern: PropTypes.string,
    min: PropTypes.number,
    max: PropTypes.number,
    disabled: PropTypes.bool,
    readOnly: PropTypes.bool,
    hidden: PropTypes.bool,
    textAlign: PropTypes.oneOf([
      'left',
      'center',
      'right',
    ]),
    format: PropTypes.string,
    prefix: PropTypes.node,
    postfix: PropTypes.node,
    step: PropTypes.number,
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
    suggestList: PropTypes.array,
  }

  static defaultProps = {
    value: '',
    required: false,
    disabled: false,
    readOnly: false,
    hidden: false,
    format: '0,0[.][00]',
    pattern: '[0-9]*',
    textAlign: 'left',
    invalidFeedback: 'This field is required.',
    inputSize: "default",
  }

  constructor(props) {
    super(props)
    this.id = this.props.id || guid()
    let {value, format} = this.props
    let numberValue = parseFloat(value)
    let formatValue = ''
    if (!isNaN(numberValue)) {
      formatValue = numeral(numberValue).format(format)
    } else {
      numberValue = ''
    }
    this.state = {
      value: numberValue,
      formatValue,
      focus: false,
    }
    this.value = this.state.value // for ref.value
  }

  componentWillReceiveProps(nextProps) {
    let {value, format} = nextProps
    if (value === this.props.value && format === this.props.format) {
      return
    }
    let numberValue = parseFloat(value)
    let formatValue = ''
    if (!isNaN(numberValue)) {
      formatValue = numeral(numberValue).format(format)
    } else {
      numberValue = ''
    }
    this.setState({value: numberValue, formatValue}, () => {
      this.value = this.state.value // for ref.value
    })
  }

  onChange(value) {
    let {onChange, format, max} = this.props
    let numberValue = parseFloat(value)
    if (typeof max === "number" && numberValue > max) {
      numberValue = max
    }
    let formatValue = ''
    if (!isNaN(numberValue)) {
      formatValue = numeral(numberValue).format(format)
    } else {
      numberValue = ''
    }
    this.setState({value: numberValue, formatValue}, () => {
      onChange && onChange(this.state.value)
    })
  }

  onFocus(e) {
    let {onFocus} = this.props
    this.setState({focus: true}, () => {
      onFocus && onFocus(e)
    })
  }

  onBlur(value) {
    let {onBlur} = this.props
    this.setState({focus: false}, () => {
      onBlur && onBlur(this.state.value)
    })
  }

  onClick(e) {
    const {onClick} = this.props
    onClick && onClick(e)
  }

  render() {
    const {
      label,
      required,
      placeholder,
      pattern,
      min,
      max,
      disabled,
      readOnly,
      hidden,
      textAlign,
      prefix,
      postfix,
      step,
      format,
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
      suggestList,
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
    if (textAlign === "center") {
      inputClass += " text-center"
      textClass += " text-center"
    } else if (textAlign === "right") {
      inputClass += " text-right"
      textClass += " text-right"
    }
    if (viewMode) {
      return (
        <FormField id={id} label={label} required={required} hidden={hidden} inline={inline} colSize={colSize}
                   tooltip={tooltip} className={className} style={style}>
          <pre id={id} className={textClass}>
            {typeof prefix === "string" ? prefix : ''}{this.state.formatValue}{typeof postfix === "string" ? postfix : ''}
          </pre>
        </FormField>
      )
    }
    let datalist = null
    let list = null
    if (suggestList && suggestList.length > 0) {
      list = id + "-suggests"
      datalist = (
        <datalist id={list}>
          {suggestList.map((suggest, index) => <option key={id + "-suggest_" + index} value={suggest}/>)}
        </datalist>
      )
    }
    return (
      <FormField id={id} label={label} required={required} hidden={hidden} inline={inline} colSize={colSize}
                 tooltip={tooltip} className={className} style={style}>
        <div className="input-group">
          {prefix && <div className="input-group-prepend">{typeof prefix === "string" ?
            <span className="input-group-text">{prefix}</span> : prefix}</div>}
          <input
            className={inputClass}
            id={id}
            type={this.state.focus ? 'number' : 'tel'}
            value={this.state.focus ? this.state.value : this.state.formatValue}
            placeholder={placeholder}
            pattern={this.state.focus ? pattern : '[0-9.,]*'}
            inputMode="numeric"
            min={this.state.focus ? min : (typeof min === "number" ? numeral(min).format(format) : null)}
            max={this.state.focus ? max : (typeof max === "number" ? numeral(max).format(format) : null)}
            disabled={disabled}
            readOnly={readOnly}
            onChange={e => this.onChange(e.target.value)}
            onBlur={e => this.onBlur(e.target.value)}
            onFocus={e => this.onFocus(e)}
            onClick={e => this.onClick(e)}
            required={required}
            step={step}
            style={inputStyle}
            list={list}
          />
          {postfix && <div className="input-group-append">{typeof postfix === "string" ?
            <span className="input-group-text">{postfix}</span> : postfix}</div>}
          <div className="invalid-feedback">
            {invalidFeedback}
          </div>
          {datalist}
        </div>
      </FormField>
    )
  }
}
