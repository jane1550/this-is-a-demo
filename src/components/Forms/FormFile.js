/**
 * Created by haydn.chen on 3/20/2018.
 */
import React from 'react'
import PropTypes from 'prop-types'
import FormField from './FormField'
import {guid} from '../../common/utils'

export default class FormFile extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    label: PropTypes.node,
    value: PropTypes.string,
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    readOnly: PropTypes.bool,
    hidden: PropTypes.bool,
    accept: PropTypes.string,
    multiple: PropTypes.bool,
    lang: PropTypes.oneOf([
      'en',
      'zh-CN',
    ]),
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
    placeholder: 'Choose file',
    accept: 'image/*',
    multiple: false,
    lang: 'en',
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

  render() {
    const {
      label,
      required,
      value,
      placeholder,
      disabled,
      readOnly,
      onChange,
      hidden,
      accept,
      multiple,
      lang,
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
    let inputClass = "custom-file-input"
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
            {value}
          </pre>
        </FormField>
      )
    }
    return (
      <FormField id={id} label={label} required={required} hidden={hidden} inline={inline} colSize={colSize}
                 tooltip={tooltip} className={className} style={style}>
        <div className="custom-file">
          <input type="file" className={inputClass} id={id}
                 value={value}
                 disabled={disabled}
                 readOnly={readOnly}
                 onChange={e => this.onChange(e.target.value)}
                 required={required}
                 accept={accept} multiple={multiple} lang={lang} style={inputStyle}
          />
          <label className="custom-file-label" htmlFor="customFile">{placeholder}</label>
          <div className="invalid-feedback">
            {invalidFeedback}
          </div>
        </div>
      </FormField>
    )
  }
}
