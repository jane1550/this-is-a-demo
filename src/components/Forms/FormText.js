/**
 * Created by haydn.chen on 3/20/2018.
 */
import React from 'react'
import PropTypes from 'prop-types'
import FormField from './FormField'
import {guid} from '../../common/utils'

export default class FormText extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    label: PropTypes.node,
    value: PropTypes.node,
    required: PropTypes.bool,
    hidden: PropTypes.bool,
    children: PropTypes.node,
    textAlign: PropTypes.oneOf([
      'left',
      'center',
      'right',
    ]),
    inline: PropTypes.bool,
    colSize: PropTypes.oneOf([
      "small",
      "middle",
      "large",
      "full",
    ]),
    className: PropTypes.string,
    style: PropTypes.object,
  }

  static defaultProps = {
    required: false,
    hidden: false,
    textAlign: 'left',
  }

  constructor(props) {
    super(props)
    this.id = this.props.id || guid()
  }

  render() {
    const {
      label,
      required,
      hidden,
      children,
      textAlign,
      inline,
      colSize,
      value,
      tooltip,
      className,
      style,
    } = this.props
    const id = this.id
    let textClass = "w-100 col-form-label pre-wrap"
    if (textAlign === "center") {
      textClass += " text-center"
    } else if (textAlign === "right") {
      textClass += " text-right"
    }
    return (
      <FormField id={id} label={label} required={required} hidden={hidden} inline={inline} colSize={colSize}
                 tooltip={tooltip} className={className} style={style}>
        {value ?
          <pre id={id} className={textClass}>{value}</pre>
          :
          <div id={id} className={textClass}>
            {children}
          </div>
        }
      </FormField>
    )
  }
}
