/**
 * Created by haydn.chen on 3/27/2018.
 */
import React from 'react'
import Loading from '../Loading'
import {Alert, Confirm, Toast, Modal} from '../Dialog'
import Collapse from '../Collapse'
import {guid} from '../../common/utils'

export default class BaseComponent extends React.Component {
  constructor(props) {
    super(props)
    this.id = guid()
    this.loading = false
    this.leftMenuOpen = this.getDefaultLeftMenuOpen()
    this.rightMenuOpen = this.getDefaultRightMenuOpen()
  }

  showLoading() {
    this.loading = true
    this.setState({})
  }

  hideLoading() {
    this.loading = false
    this.setState({})
  }

  alert(message, title = null) {
    this.refs.alert.show(message, title)
  }

  confirm(message, title = null, confirmCallback = null, cancelCallback = null) {
    this.refs.confirm.show(message, title, confirmCallback, cancelCallback)
  }

  toast(message, type = 'info', duration = 1500, top = '40%') {
    this.refs.toast.show(message, type, duration, top)
  }

  openModal(content, title = null) {
    this.refs.modal.show(content, title)
  }

  closeModal() {
    this.refs.modal.hide()
  }

  openLeftMenu() {
    this.leftMenuOpen = true
    this.setState({}, () => {
      const innerWidth = window.innerWidth
      if (innerWidth < 768) {
        $('#' + this.id).scrollTop(0)
      }
    })
  }

  closeLeftMenu() {
    if (innerWidth < 768) {
      $('#' + this.id).scrollTop(0)
    }
    this.leftMenuOpen = false
    this.setState({})
  }

  toggleLeftMenu() {
    if (this.leftMenuOpen) {
      this.closeLeftMenu()
    } else {
      this.openLeftMenu()
    }
  }

  openRightMenu() {
    this.rightMenuOpen = true
    this.setState({}, () => {
      const innerWidth = window.innerWidth
      if (innerWidth < 768) {
        setTimeout(() => {
          let height = $('#' + this.id)[0].scrollHeight
          $('#' + this.id).scrollTop(height)
        }, 500)
      }
    })
  }

  closeRightMenu() {
    if (innerWidth < 768) {
      let height = $('#' + this.id)[0].scrollHeight
      $('#' + this.id).scrollTop(height)
    }
    this.rightMenuOpen = false
    this.setState({})
  }

  toggleRightMenu() {
    if (this.rightMenuOpen) {
      this.closeRightMenu()
    } else {
      this.openRightMenu()
    }
  }

  scrollTo(height) {
    if (typeof height === "undefined") {
      height = $('#' + this.id)[0].scrollHeight
    }
    $('#' + this.id).scrollTop(height)
  }

  scrollPlus(height) {
    let currentHeight = $('#' + this.id).scrollTop()
    $('#' + this.id).scrollTop(currentHeight + height)
  }

  scrollMinus(height) {
    let currentHeight = $('#' + this.id).scrollTop()
    $('#' + this.id).scrollTop(currentHeight - height)
  }

  render() {
    const leftMenuOpen = this.leftMenuOpen
    const rightMenuOpen = this.rightMenuOpen
    const leftMenu = this.renderLeftMenu()
    const rightMenu = this.renderRightMenu()
    let content = null
    if (leftMenu || rightMenu) {
      let mainClass = 'h-100 pl-0 pr-0 scrollable'
      let containerClass = 'h-100 d-flex'
      let direction = 'horizontal'
      const innerWidth = window.innerWidth
      if (innerWidth < 768) {
        mainClass += ' col-12'
        containerClass += ' row m-0 scrollable'
        direction = 'vertical'
      } else {
        mainClass += ' flex-fill'
      }
      content = (
        <div id={this.id} className={containerClass}>
          <Collapse className="col-12 col-sm-3 pl-0 pr-0 border-right scrollable"
                    isOpen={leftMenu && leftMenuOpen} direction={direction}>
            {leftMenu}
          </Collapse>
          <div className={mainClass}>
            {this.renderContent()}
          </div>
          <Collapse className="col-12 col-sm-3 pl-0 pr-0 border-left scrollable"
                    isOpen={rightMenu && rightMenuOpen} direction={direction}>
            {rightMenu}
          </Collapse>
        </div>
      )
    } else {
      content = (
        <div id={this.id} className="scrollable h-100">
          {this.renderContent()}
        </div>
      )
    }
    return (
      <article className="page">
        <Alert ref="alert"/>
        <Confirm ref="confirm"/>
        <Toast ref="toast"/>
        <Modal ref="modal"/>
        <Loading show={this.props.loading || this.loading}/>
        <header className="page-header">{this.renderHeader()}</header>
        <section className="page-content h-100">
          {content}
        </section>
        <footer className="page-footer">{this.renderFooter()}</footer>
      </article>
    )
  }

  renderHeader() {
    return null
  }

  renderContent() {
    return null
  }

  renderFooter() {
    return null
  }

  renderLeftMenu() {
    return null
  }

  renderRightMenu() {
    return null
  }

  getDefaultLeftMenuOpen() {
    return false
  }

  getDefaultRightMenuOpen() {
    return false
  }
}
