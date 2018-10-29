/**
 * Created by haydn.chen on 3/20/2018.
 */
import React from 'react'
import PropTypes from 'prop-types'
import FormField from './FormField'
import {guid} from '../../common/utils'

export default class FormAction extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    hidden: PropTypes.bool,
    children: PropTypes.node,
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
    colSize: "full",
  }

  constructor(props) {
    super(props)
    this.id = this.props.id || guid()
  }

  render() {
    const {hidden, children, inline, colSize, className, style} = this.props
    const id = this.id
    return (
      <FormField id={id} hidden={hidden} inline={inline} colSize={colSize} className={className} style={style}>
        <div id={id} className="d-flex justify-content-around flex-wrap">
          {children}
        </div>
      </FormField>
    )
  }
}
