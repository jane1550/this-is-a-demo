import React from 'react'
import PropTypes from 'prop-types'
import './PageLayout.scss'

export default class PageLayout extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false
    }
    const introducerCode = this.props.location.query.introducerCode
    const agentCode = this.props.location.query.agentCode
    if (introducerCode) {
      sessionStorage.setItem("SALES_APP_INTRODUCER_CODE", introducerCode)
    }
    if (agentCode) {
      sessionStorage.setItem("SALES_APP_SHARE_AGENT_CODE", agentCode)
    }
  }

  static propTypes = {
    children: PropTypes.node
  }

  componentDidUpdate() {
    const layout = document.getElementById('layout')
    if (layout && this.props.location.pathname !== '/login') {
      layout.className = ''
      layout.style.display = 'none'
      setTimeout(() => {
        layout.style.display = 'block'
        layout.className = 'new'
      }, 50)
    }
  }

  render() {
    const {children} = this.props
    return (
      <div style={{height: '100%'}} id="layout">
        {children}
      </div>
    )
  }
}
