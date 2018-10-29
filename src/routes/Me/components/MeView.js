import React from 'react'
import PropTypes from 'prop-types'
import './MeView.scss'
import browserHistory from '../../../common/history'
import BaseComponent from '../../../components/BaseComponent'
import { Icon, Grid } from 'antd-mobile'

const list = [
  { icon: 'check', text: 'Claim', path: '/claim/0' },
  // { icon: 'check-circle', text: 'CS', path: '/' },
];
const userInfo = JSON.parse(sessionStorage.getItem('SALES_APP_PRODUCER'))
export default class MeView extends BaseComponent {
  constructor(props) {
    super(props)

  }

  componentWillMount() {
    this.checkLogin()
  }

  checkLogin() {
    let userString = sessionStorage.getItem("SALES_APP_PRODUCER")
    let loginInApp = sessionStorage.getItem("SALES_APP_FROM_LOGIN")
    if (!userString || loginInApp !== "true") {
      sessionStorage.setItem("SALES_APP_REDIRECT_URL", this.props.location.pathname + this.props.location.search)
      browserHistory.replace('/login')
    }
  }

  renderHeader() {
    return (
      <div className="bg-primary d-flex justify-content-around">
        <h1 className="text-white">Me</h1>
      </div>
    )
  }

  logout() {
    this.confirm('Are you sure to exit?', 'Warning', () => {
      this.showLoading()
      setTimeout(() => {
        this.hideLoading()
        sessionStorage.clear()
        this.setState({}, () => {
          browserHistory.replace('/')
        })
      }, 1000)
    })
  }

  gotoChangePassword() {
    sessionStorage.setItem("SALES_APP_REDIRECT_URL", "goBack")
    browserHistory.push('/login?action=changePassword')
  }

  renderContent() {
    let userString = sessionStorage.getItem("SALES_APP_PRODUCER")
    const producer = JSON.parse(userString)

    const data = list.map(item => ({
      icon: (<Icon type={item.icon} onClick={() => browserHistory.push(item.path)} />),
      text: item.text,
    }));

    return (
      <div className="h-100 bg-light pt-3">
        {/* 用户信息 */}
        <div className="list-group">
          <a onClick={() => browserHistory.push('/userProfile')} className="list-group-item list-group-item-action d-flex p-3 align-items-center" tabIndex={1}>
            <h1 className="mb-0"><i className="far fa-user-circle" /></h1>
            <div className="ml-3 flex-fill">
              <div><big>{producer && producer.producerName}</big></div>
              <div>{producer && producer.producerPhone}</div>
            </div>
          </a>
        </div>
        {/* 常规操作 */}
        <div className="list-group mt-2">
          <a className="list-group-item list-group-item-action pt-1 pb-1 d-flex pl-4 align-items-center" tabIndex={2}>
            <h4 className="mb-0"><i className="fas fa-user text-center" style={{ width: '30px' }} /></h4>
            <div className="p-2 ml-3 flex-fill">My Customers</div>
          </a>
          <a onClick={() => browserHistory.push('/policies')} className="list-group-item list-group-item-action pt-1 pb-1 d-flex pl-4 align-items-center" tabIndex={3}>
            <h4 className="mb-0"><i className="fas fa-file-alt text-center" style={{ width: '30px' }} /></h4>
            <div className="p-2 ml-3 flex-fill">My Policies</div>
          </a>
          <a onClick={() => browserHistory.push('/orders')} className="list-group-item list-group-item-action pt-1 pb-1 d-flex pl-4 align-items-center" tabIndex={3}>
            <h4 className="mb-0"><i className="fas fa-cart-plus text-center" style={{ width: '30px' }} /></h4>
            <div className="p-2 ml-3 flex-fill">My Orders</div>
          </a>
          <a onClick={() => browserHistory.push('/quotations')} className="list-group-item list-group-item-action pt-1 pb-1 d-flex pl-4 align-items-center" tabIndex={3}>
            <h4 className="mb-0"><i className="fas fa-map text-center" style={{ width: '30px' }} /></h4>
            <div className="p-2 ml-3 flex-fill">My Quotations</div>
          </a>
          <a onClick={() => browserHistory.push('/claim/0')} className="list-group-item list-group-item-action pt-1 pb-1 d-flex pl-4 align-items-center" tabIndex={3}>
            <h4 className="mb-0"><i className="fas fa-theater-masks text-center" style={{ width: '30px' }} /></h4>
            <div className="p-2 ml-3 flex-fill">My Claims</div>
          </a>
          <a className="list-group-item list-group-item-action pt-1 pb-1 d-flex pl-4 align-items-center" tabIndex={3}>
            <h4 className="mb-0"><i className="fab fa-lastfm text-center" style={{ width: '30px' }} /></h4>
            <div className="p-2 ml-3 flex-fill">My Customer Services</div>
          </a>
          <a onClick={this.gotoChangePassword.bind(this)} className="list-group-item list-group-item-action pt-1 pb-1 d-flex pl-4 align-items-center" tabIndex={4}>
            <h4 className="mb-0"><i className="fas fa-unlock text-center" style={{ width: '30px' }} /></h4>
            <div className="p-2 ml-3 flex-fill">Change Password</div>
          </a>
          <a className="list-group-item list-group-item-action pt-1 pb-1 d-flex pl-4 align-items-center" tabIndex={5}
            onClick={e => this.logout()}>
            <h4 className="mb-0"><i className="fas fa-power-off text-center" style={{ width: '30px' }} /></h4>
            <div className="p-2 ml-3 flex-fill">Exit</div>
          </a>
        </div>
      </div>
    )
  }

  renderFooter() {
    return (
      <nav className="nav nav-pills nav-justified bg-grey shadow-lg">
        <a className="nav-item nav-link border-right p-2 d-flex flex-column" tabIndex={91}
          onClick={e => browserHistory.replace('/')}>
          <h4 className="mb-0"><i className="fas fa-home" /></h4>
          <small>Home</small>
        </a>
        <a className="nav-item nav-link active border-right p-2 d-flex flex-column" tabIndex={92}>
          <h4 className="mb-0"><i className="fas fa-user-circle" /></h4>
          <small>Me</small>
        </a>
      </nav>
    )
  }
}
