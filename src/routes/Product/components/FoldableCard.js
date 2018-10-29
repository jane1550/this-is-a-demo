import React from 'react'
import PropTypes from 'prop-types'
import './ProductView.scss'
import {guid} from "../../../common/utils"
import Collapse from '../../../components/Collapse'

export default class FoldableCard extends React.Component {
  static propTypes = {
    title: PropTypes.node,
    children: PropTypes.node,
    collapse: PropTypes.bool,
    collapsed: PropTypes.bool,
  };

  static defaultProps = {
    collapse: true,
    collapsed: false,
  }

  constructor(props) {
    super(props)
    this.id = this.props.id || guid()
    this.state = {
      showChildren: !(this.props.collapse && this.props.collapsed)
    }
  }


  toggleShowChildren(e) {
    this.setState({showChildren: !this.state.showChildren})
  }

  render() {
    const id = this.id
    const {title, children, collapse} = this.props
    let arrow = null
    if (collapse) {
      if (!this.state.showChildren) {
        arrow = <i className="fas fa-angle-down text-secondary" onClick={this.toggleShowChildren.bind(this)}/>
      } else {
        arrow = <i className="fas fa-angle-up text-secondary" onClick={this.toggleShowChildren.bind(this)}/>
      }
    } else {
      arrow = <i className="fas fa-angle-up text-secondary invisible" onClick={this.toggleShowChildren.bind(this)}/>
    }
    return (
      <div id={id} className="card m-2 shadow-sm">
        <div className="card-header d-flex justify-content-between align-items-center p-2 pl-3 pr-3">
          <h4 className="text-center flex-fill ml-3">{title}</h4>
          {arrow}
        </div>
        {children &&
        <Collapse isOpen={this.state.showChildren} className="card-body p-0">
          {children}
        </Collapse>}
      </div>
    )
  }
}
