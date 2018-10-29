/**
 * Created by haydn.chen on 3/23/2018.
 */
import React from 'react'
import PropTypes from 'prop-types'
import FormField from './FormField'
import Toggle from 'react-bootstrap-toggle'
import {guid} from '../../common/utils'

export default class FormToggle extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    label: PropTypes.node,
    value: PropTypes.bool,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    readOnly: PropTypes.bool,
    hidden: PropTypes.bool,
    description: PropTypes.node,
    on: PropTypes.node,
    off: PropTypes.node,
    inline: PropTypes.bool,
    colSize: PropTypes.oneOf([
      "small",
      "middle",
      "large",
      "full",
    ]),
    viewMode: PropTypes.bool,
    tooltip: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
  }

  static defaultProps = {
    required: false,
    disabled: false,
    readOnly: false,
    hidden: false,
    on: 'Yes',
    off: 'No',
  }

  constructor(props) {
    super(props)
    this.id = this.props.id || guid()
    this.state = {
      value: !!this.props.value
    }
    this.value = this.state.value // for ref.value
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value === this.props.value) {
      return
    }
    this.setState({value: !!nextProps.value}, () => {
      this.value = this.state.value // for ref.value
    })
  }

  onToggle() {
    const {onChange, readOnly, disabled, viewMode} = this.props
    if (readOnly || disabled || viewMode) {
      return
    }
    this.setState({value: !this.state.value}, () => {
      this.value = this.state.value // for ref.value
      onChange && onChange(this.state.value)
    });
  }

  render() {
    const {
      label,
      required,
      hidden,
      description,
      on,
      off,
      disabled,
      inline,
      colSize,
      viewMode,
      tooltip,
      className,
      style,
    } = this.props
    const id = this.id
    return (
      <FormField id={id} label={label} required={required} hidden={hidden} inline={inline} colSize={colSize}
                 tooltip={tooltip} className={className} style={style}>
        <label id={id} className="d-flex align-items-center flex-row-reverse mb-0">
          <Toggle
            on={on}
            off={off}
            onstyle={(disabled || viewMode) ? "disabled" : "primary"}
            offstyle={(disabled || viewMode) ? "disabled" : "secondary"}
            active={this.state.value}
            disabled={disabled || viewMode}
            onClick={this.onToggle.bind(this)}
          />
          <span className="ml-2 mr-2">{description}</span>
        </label>
      </FormField>
    )
  }
}
