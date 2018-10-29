/**
 * Created by haydn.chen on 3/19/2018.
 */
import React from 'react'
import PropTypes from 'prop-types'
import {guid} from '../../common/utils'
import Collapse from '../Collapse'
import './Forms.scss'

export default class FormGroup extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    icon: PropTypes.node,
    title: PropTypes.node,
    children: PropTypes.node,
    collapse: PropTypes.bool,
    collapsed: PropTypes.bool,
    buttons: PropTypes.array,
    action: PropTypes.string,
    onSubmit: PropTypes.func,
    className: PropTypes.string,
    style: PropTypes.object,
  }

  static defaultProps = {
    collapse: true,
    collapsed: false,
    buttons: [],
  }

  constructor(props) {
    super(props)
    this.id = this.props.id || guid()
    this.state = {
      showChildren: !(this.props.collapse && this.props.collapsed)
    }
  }

  componentWillReceiveProps(nextProps) {
    const {collapse, collapsed} = nextProps
    if (!collapse) {
      this.setState({showChildren: false})
    } else if (this.props.collapsed !== collapsed) {
      this.setState({showChildren: !collapsed})
    }
  }

  toggleShowChildren(e) {
    this.setState({showChildren: !this.state.showChildren})
  }

  valid() {
    let form = document.forms[this.id]
    let result = form.checkValidity()
    let invalidElements = $("#" + this.id + " .is-invalid")
    form.classList.add('was-validated')
    return result && invalidElements.length <= 0
  }

  onSubmit(e) {
    const {onSubmit} = this.props
    if (onSubmit) {
      onSubmit(e)
      e.preventDefault()
    }
  }

  render() {
    const {title, icon, buttons, children, collapse, action, className, style} = this.props
    const id = this.id
    let actionList = []
    if (buttons && buttons.length > 0) {
      for (let i = buttons.length, l = buttons.length; i >= 0; i--) {
        if (i === l) {
          let actionButton = <span key={`action_${i}`} className="ml-1 mr-3">{buttons[i]}</span>
          actionList.push(actionButton)
        } else {
          let actionButton = <span key={`action_${i}`} className="ml-1 mr-1">{buttons[i]}</span>
          actionList.push(actionButton)
        }
      }
    }
    let arrow = null
    if (collapse) {
      if (!this.state.showChildren) {
        arrow = <i className="fas fa-angle-down text-primary" onClick={this.toggleShowChildren.bind(this)}/>
      } else {
        arrow = <i className="fas fa-angle-up text-primary" onClick={this.toggleShowChildren.bind(this)}/>
      }
    } else {
      arrow = <i className="fas fa-angle-up text-primary invisible" onClick={this.toggleShowChildren.bind(this)}/>
    }
    let containerClass = "needs-validation w-100"
    if (className) {
      containerClass += " " + className
    }
    return (
      <form id={id} className={containerClass} action={action}
            onSubmit={this.onSubmit.bind(this)} style={style}>
        <div className="border m-2 shadow-sm">
          {(icon || title || actionList.length > 0) &&
          <div className="d-flex justify-content-between pl-2 pr-2 border-bottom shadow-sm bg-light">
            <div className="d-inline-flex align-items-center p-1">
              <h1 className="m-0">{icon}</h1>
              <h6 className="m-2">{title}</h6>
            </div>
            <div className="d-inline-flex flex-row-reverse align-items-center p-1">
              {arrow}
              {actionList}
            </div>
          </div>
          }
          <Collapse isOpen={this.state.showChildren}>
            <div className="row m-0">
              {children}
            </div>
          </Collapse>
        </div>
      </form>
    )
  }
}