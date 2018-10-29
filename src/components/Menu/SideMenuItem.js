/**
 * Created by haydn.chen on 4/19/2018.
 */
import React from 'react'
import PropTypes from 'prop-types'
import {guid} from '../../common/utils'
import Collapse from '../Collapse'
import './Menu.scss'

export default class SideMenuItem extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    icon: PropTypes.node,
    title: PropTypes.node,
    indent: PropTypes.oneOf([0, 1, 2, 3, 4]),
    children: PropTypes.node,
    align: PropTypes.oneOf([
      'left',
      'right',
    ]),
    bgColor: PropTypes.oneOf([
      'primary',
      'secondary',
      'success',
      'danger',
      'warning',
      'info',
      'light',
      'dark',
      'white',
    ]),
    defaultOpen: PropTypes.bool,
    active: PropTypes.bool,
    onClick: PropTypes.func,
    disabled: PropTypes.bool,
    className: PropTypes.string,
    style: PropTypes.object,
  }

  static defaultProps = {
    indent: 0,
    align: "left",
    defaultOpen: false,
    active: false,
  }

  constructor(props) {
    super(props)
    this.id = this.props.id || guid()
    const {children, defaultOpen} = this.props
    this.state = {
      open: children && defaultOpen,
    }
  }

  toggleOpen(e) {
    const {onClick, disabled} = this.props
    if (disabled) {
      return
    }
    this.setState({open: !this.state.open}, ()=> {
      onClick && onClick(e)
    })
  }

  render() {
    const {icon, title, indent, children, align, bgColor, active, disabled, className, style} = this.props
    const {open} = this.state
    const id = this.id
    let containerClass = "list-group-item list-group-item-action p-0 rounded-0"
    if (bgColor) {
      containerClass += " bg-" + bgColor
    }
    if (active) {
      containerClass += " active"
    }
    let indentClass = "d-flex align-items-center menu-item-content"
    if (!disabled) {
      indentClass += " hover-pointer"
    } else {
      containerClass += " disabled"
    }
    let iconClass = "mb-0"
    if (align === "right") {
      indentClass += " flex-row-reverse"
      indentClass += " pr-" + indent
      iconClass += " ml-2"
    } else {
      indentClass += " pl-" + indent
      iconClass += " mr-2"
    }
    let arrowClass = "ml-2 mr-2 text-grey"
    if (open) {
      if (align === "right") {
        arrowClass += " fas fa-caret-left"
      } else {
        arrowClass += " fas fa-caret-right"
      }
    } else {
      arrowClass += " fas fa-caret-down"
    }
    if (className) {
      containerClass += " " + className
    }
    if (children) {
      return (
        <div id={id} className={containerClass} style={style}>
          <a className={indentClass} onClick={this.toggleOpen.bind(this)}>
            {icon ? <h5 className={iconClass}>{icon}</h5> : null}
            <span className="menu-item-title">{title}</span>
            <i className={arrowClass}/>
          </a>
          <Collapse isOpen={open} className="list-group">
            {children}
          </Collapse>
        </div>
      )
    } else {
      return (
        <button id={id} className={containerClass} onClick={this.toggleOpen.bind(this)}
                disabled={disabled} style={style}>
          <div className={indentClass}>
            {icon ? <h5 className={iconClass}>{icon}</h5> : null}
            <span className="menu-item-title">{title}</span>
          </div>
        </button>
      )
    }
  }
}