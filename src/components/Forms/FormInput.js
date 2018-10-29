/**
 * Created by haydn.chen on 3/20/2018.
 */
import React from 'react'
import PropTypes from 'prop-types'
import FormField from './FormField'
import {guid, maskString} from '../../common/utils'
import Inputmask from "inputmask";

export default class FormInput extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    label: PropTypes.node,
    type: PropTypes.oneOf([
      'button',
      'checkbox',
      'color',
      'date',
      'datetime-local',
      'email',
      'file',
      'hidden',
      'image',
      'month',
      'number',
      'password',
      'radio',
      'range',
      'reset',
      'search',
      'submit',
      'tel',
      'text',
      'time',
      'url',
      'week',
    ]),
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    onClick: PropTypes.func,
    placeholder: PropTypes.string,
    required: PropTypes.bool,
    pattern: PropTypes.string,
    minLength: PropTypes.number,
    maxLength: PropTypes.number,
    min: PropTypes.number,
    max: PropTypes.number,
    size: PropTypes.number,
    disabled: PropTypes.bool,
    readOnly: PropTypes.bool,
    hidden: PropTypes.bool,
    textAlign: PropTypes.oneOf([
      'left',
      'center',
      'right',
    ]),
    prefix: PropTypes.node,
    postfix: PropTypes.node,
    suggestList: PropTypes.array,
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
    mask: PropTypes.string,
    inputMask: PropTypes.string,
    valueUnmask: PropTypes.bool,
    className: PropTypes.string,
    style: PropTypes.object,
  }

  static defaultProps = {
    type: 'text',
    required: false,
    disabled: false,
    readOnly: false,
    hidden: false,
    textAlign: 'left',
    invalidFeedback: 'This field is required.',
    inputSize: "default",
  }

  constructor(props) {
    super(props)
    this.id = this.props.id || guid()
    let {value, mask, inputMask} = this.props
    let realValue = (typeof value === "undefined" || value === null) ? '' : value.toString()
    let formatValue = realValue
    if (inputMask && formatValue) {
      formatValue = Inputmask(inputMask).format(formatValue)
    } else if (mask && formatValue) {
      formatValue = maskString(formatValue, mask)
    }
    this.state = {
      value: realValue,
      formatValue,
      focus: false,
    }
    this.value = this.state.value
  }

  componentWillReceiveProps(nextProps) {
    let {value, mask, inputMask} = nextProps
    if (value === this.props.value && mask === this.props.mask && inputMask === this.props.inputMask) {
      return
    }
    let realValue = (typeof value === "undefined" || value === null) ? '' : value.toString()
    let formatValue = realValue
    if (inputMask && formatValue) {
      formatValue = Inputmask(inputMask).format(formatValue)
    } else if (mask && formatValue) {
      formatValue = maskString(formatValue, mask)
    }
    this.setState({value: realValue, formatValue}, () => {
      this.value = this.state.value
    })
  }

  componentDidMount() {
    if (this.props.inputMask) {
      Inputmask(this.props.inputMask).mask($("#" + this.id))
    }
  }

  onChange(value) {
    let {onChange, mask, inputMask, valueUnmask} = this.props
    let realValue = value
    if (inputMask && valueUnmask) {
      realValue = Inputmask.unmask(realValue, {alias: inputMask})
    }
    let formatValue = realValue
    if (inputMask && formatValue) {
      formatValue = Inputmask(inputMask).format(formatValue)
    } else if (mask && formatValue) {
      formatValue = maskString(formatValue, mask)
    }
    this.setState({value: realValue, formatValue}, () => {
      this.value = this.state.value
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
      type,
      required,
      placeholder,
      pattern,
      minLength,
      maxLength,
      min,
      max,
      size,
      disabled,
      readOnly,
      hidden,
      textAlign,
      prefix,
      postfix,
      suggestList,
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
            type={type}
            value={this.state.focus ? this.state.value : this.state.formatValue}
            placeholder={placeholder}
            pattern={pattern}
            minLength={minLength}
            maxLength={maxLength}
            min={min}
            max={max}
            size={size}
            disabled={disabled}
            readOnly={readOnly}
            onChange={e => this.onChange(e.target.value)}
            onBlur={e => this.onBlur(e.target.value)}
            onFocus={e => this.onFocus(e)}
            onClick={e => this.onClick(e)}
            required={required}
            list={list}
            style={inputStyle}
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
