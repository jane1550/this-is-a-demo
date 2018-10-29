/**
 * Created by haydn.chen on 3/20/2018.
 */
import React from 'react'
import PropTypes from 'prop-types'
import FormField from './FormField'
import {guid, getLabelByValue} from '../../common/utils'

function getChildOptions(options, parentKey) {
  if (options && options.length > 0) {
    for (let option of options) {
      if (option && typeof (option.value) !== "undefined" && option.value === parentKey) {
        return option.children || []
      }
    }
  }
  return []
}

function fireOnChange(target) {
  if (!target) {
    return
  }
  if (document.createEventObject) {
    target.fireEvent("onchange");
  } else {
    let evt = document.createEvent("HTMLEvents");
    evt.initEvent("change", true, true);
    target.dispatchEvent(evt);
  }
}

export default class FormCascadeSelect extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    label: PropTypes.string,
    options: PropTypes.array, // format: {label, value, children: [{label, value, children: [{label, value, children[...]}]}]}
    blankOptions: PropTypes.array, // format: ['Please Select Level1', 'Please Select Level2', 'Please Select Level3'],
    value: PropTypes.array, // format: ['level1', 'level2', 'level3']
    onChange: PropTypes.func,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    readOnly: PropTypes.bool,
    hidden: PropTypes.bool,
    level: PropTypes.number,
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
    className: PropTypes.string,
    style: PropTypes.object,
  }

  static defaultProps = {
    required: false,
    disabled: false,
    readOnly: false,
    hidden: false,
    options: [],
    blankOptions: [],
    level: 2,
    invalidFeedback: 'This field is required.',
    inputSize: "default",
    align: "vertical",
  }

  constructor(props) {
    super(props)
    this.id = this.props.id || guid()
    this.state = this.buildState(this.props)
    this.value = this.state.value // for ref.value
  }


  buildState(props) {
    let defaultValue = []
    let optionsGroup = []
    for (let i = 1; i <= props.level; i++) {
      defaultValue.push('')
    }
    let value = props.value || defaultValue
    let childOptions = props.options
    for (let i = 1; i <= props.level; i++) {
      optionsGroup.push(childOptions)
      childOptions = getChildOptions(childOptions, value[i - 1])
    }
    return {
      value,
      optionsGroup,
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value === this.props.value
      && nextProps.options === this.props.options
      && nextProps.level === this.props.level) {
      return
    }
    this.setState(this.buildState(nextProps), () => {
      this.value = this.state.value // for ref.value
    })

  }

  componentDidMount() {
    // auto detect cascade select should horizontal or not
    const {level} = this.props
    let width = this.refs.cascadeSelect.offsetWidth
    if (width === 0) {
      return
    }
    let screenWidth = window.innerWidth
    let horizontal = (width / level) > 150 && (width / screenWidth) > 0.4
    this.setState({horizontal})
  }

  getOptionElements(options, level) {
    const {blankOptions, readOnly} = this.props
    const id = this.id
    let optionElements = [];
    if (blankOptions && blankOptions[level - 1]) {
      optionElements.push(<option key={id + '_' + (level - 1) + '-option_'} value=""
                                  disabled={readOnly}>{blankOptions[level - 1]}</option>)
    }
    if (options && options.length > 0) {
      options.map((option, index) => {
        if (option && typeof (option.value) !== "undefined") {
          optionElements.push(<option key={id + '_' + (level - 1) + '-option_' + index} value={option.value}
                                      disabled={readOnly}>{option.label}</option>)
        } else {
          optionElements.push(<option key={id + '_' + (level - 1) + '-option_' + index} value={option}
                                      disabled={readOnly}>{option}</option>)
        }
      })
    }
    return optionElements
  }

  onLevelChange(selectedValue, level) {
    if (level > this.props.level) {
      return
    }
    const {onChange} = this.props
    const id = this.id
    __DEV__ && console.log(`select value [${selectedValue}] on [${id + '_' + (level - 1)}]`)
    let value = this.state.value
    value[level - 1] = selectedValue
    let optionsGroup = this.state.optionsGroup
    let childOptions = getChildOptions(optionsGroup[level - 1], selectedValue)
    optionsGroup[level] = childOptions
    this.setState({value, optionsGroup}, () => {
      this.value = this.state.value // for ref.value
      onChange && onChange(this.state.value)
      // reselect child level if parent changed
      let childLevelSelect = document.getElementById(id + '_' + level)
      if (childLevelSelect) {
        fireOnChange(childLevelSelect)
      }
      // an alternative way to fire children onchange
      // if (level + 1 <= this.props.level) {
      //   if (blankOptions && blankOptions[level]) {
      //     this.onLevelChange('', level + 1)
      //   } else {
      //     let childValue = ''
      //     let childOptions = this.state.optionsGroup[level]
      //     if (childOptions && childOptions.length > 0) {
      //       let firstOption = childOptions[0]
      //       childValue = (firstOption && typeof (firstOption.value) !== "undefined")? firstOption.value : firstOption
      //     }
      //     this.onLevelChange(childValue, level + 1)
      //   }
      // }
    })
  }

  getSelectElements() {
    const {required, disabled, readOnly, level, invalidFeedback, invalid, inputClassName, inputStyle, inputSize, align} = this.props
    const id = this.id
    let selectElements = []
    let containerClass = null
    if (align === "horizontal") {
      containerClass = "flex-grow-1"
    }
    let className = "form-control"
    if (inputSize === "small") {
      className += " form-control-sm"
    } else if (inputSize === "large") {
      className += " form-control-lg"
    }
    if (invalid) {
      className += " is-invalid"
    }
    if (inputClassName) {
      className += " " + inputClassName
    }
    for (let i = 1; i <= level; i++) {
      selectElements.push(
        <div key={id + '_' + (i - 1)} className={containerClass}>
          <select
            className={className}
            id={id + '_' + (i - 1)}
            value={this.state.value[i - 1]}
            disabled={disabled}
            readOnly={readOnly}
            required={required}
            onChange={e => this.onLevelChange(e.target.value, i)}
            style={inputStyle}
          >
            {this.getOptionElements(this.state.optionsGroup[i - 1], i)}
          </select>
          <div key={id + '_' + (i - 1) + '-invalid-feedback'} className="invalid-feedback">
            {invalidFeedback}
          </div>
        </div>
      )
    }
    return selectElements
  }

  getDisplayText() {
    let labels = []
    const {value, optionsGroup} = this.state
    const {level} = this.props
    for (let i = 1; i <= level; i++) {
      labels.push(getLabelByValue(optionsGroup[i - 1], value[i - 1]))
    }
    return labels.join(' - ')
  }

  render() {
    const {label, required, hidden, inline, colSize, viewMode, tooltip, align, className, style} = this.props
    const id = this.id
    let containerClass = null
    if (align === "horizontal") {
      containerClass = "d-flex"
    }
    let textClass = "w-100 col-form-label pre-wrap"
    if (viewMode) {
      return (
        <FormField id={id} label={label} required={required} hidden={hidden} inline={inline} colSize={colSize}
                   tooltip={tooltip} className={className} style={style}>
          <pre ref="cascadeSelect" id={id} className={textClass}>
            {this.getDisplayText()}
          </pre>
        </FormField>
      )
    }
    return (
      <FormField id={id} label={label} required={required} hidden={hidden} inline={inline} colSize={colSize}
                 tooltip={tooltip} className={className} style={style}>
        <div ref="cascadeSelect" className={containerClass} id={id}>
          {this.getSelectElements()}
        </div>
      </FormField>
    )
  }
}
