/**
 * Created by haydn.chen on 4/19/2018.
 */
import React from 'react'
import PropTypes from 'prop-types'
import {guid} from '../../common/utils'

export default class SideMenu extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    children: PropTypes.node,
    className: PropTypes.string,
    style: PropTypes.object,
  }

  static defaultProps = {}

  constructor(props) {
    super(props)
    this.id = this.props.id || guid()
  }

  render() {
    const {children, className, style} = this.props
    const id = this.id
    let containerClass = "list-group"
    if (className) {
      containerClass += " " + className
    }
    return (
      <div id={id} className={containerClass} style={style}>
        {children}
      </div>
    )
  }
}