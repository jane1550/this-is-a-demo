import React from 'react'
import PropTypes from 'prop-types'
import './LoginView.scss'
import browserHistory from '../../../common/history'
import BaseComponent from '../../../components/BaseComponent'
import CryptoJS from 'crypto-js'

export default class LoginView extends BaseComponent {
  constructor(props) {
    super(props)
    const { action } = this.props.location.query
    this.state = {
      isRegister: false,
      forgotPassword: action === 'changePassword',
      remember: true,
      password: '',
      newPassword: '',
      mobile: '',
      vcode: '',
      sendDisabled: false,
      coldSeconds: 60,
    }
    let producerInSession = sessionStorage.getItem('SALES_APP_PRODUCER')
    if (producerInSession) {
      let producer = JSON.parse(producerInSession)
      this.state.mobile = producer.producerCode
    }
  }

  fecthUserAuth(reqBody) {
    this.props.actions.fecthUserAuth(reqBody, (err, data) => {
      if (err) {
        this.alert(err, 'Error')
      } else {
        sessionStorage.setItem('SALES_APP_PRODUCER', JSON.stringify(data.producer))
        sessionStorage.setItem('SALES_APP_MSG', data.msg)
        sessionStorage.setItem('SALES_APP_SIGN', data.sign)
        sessionStorage.setItem('SALES_APP_TENANT_CODE', data.tenantCode)
        sessionStorage.setItem('SALES_APP_FROM_LOGIN', "true")
        if (this.timer) {
          clearInterval(this.timer)
          this.timer = null
        }
        let redirectUrl = sessionStorage.getItem("SALES_APP_REDIRECT_URL")
        if (redirectUrl === "goBack") {
          browserHistory.goBack()
        } else if (redirectUrl) {
          browserHistory.replace(redirectUrl)
        } else {
          browserHistory.replace('/')
        }
      }
    });
  }

  login(e) {
    const { mobile, password } = this.state;
    if (!mobile || !password) {
      return
    }
    const reqBody = {
      mobile: mobile.startsWith('+')? mobile : '+86' + mobile,
      password: CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(password)),
    };
    this.fecthUserAuth(reqBody);
  }

  // 用户注册
  register(e) {
    // 装配注册表单
    const { mobile, password, vcode } = this.state;
    if (!mobile || !password || !vcode) {
      return
    }
    const registryForm = {
      // 需要的一些注册信息
      mobile: mobile.startsWith('+')? mobile : '+86' + mobile,
      password: CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(password)),
      verificationCode: vcode,
    }
    // 发送异步请求
    this.props.actions.register(registryForm, (err, data) => {
      if (err) {
        this.alert(err, 'Error')
      } else {
        sessionStorage.setItem('SALES_APP_PRODUCER', JSON.stringify(data.producer))
        sessionStorage.setItem('SALES_APP_MSG', data.msg)
        sessionStorage.setItem('SALES_APP_SIGN', data.sign)
        sessionStorage.setItem('SALES_APP_TENANT_CODE', data.tenantCode)
        sessionStorage.setItem('SALES_APP_FROM_LOGIN', "true")
        if (this.timer) {
          clearInterval(this.timer)
          this.timer = null
        }
        let redirectUrl = sessionStorage.getItem("SALES_APP_REDIRECT_URL")
        if (redirectUrl === "goBack") {
          browserHistory.goBack()
        } else if (redirectUrl) {
          browserHistory.replace(redirectUrl)
        } else {
          browserHistory.replace('/')
        }
      }

    });
  }

  changePassword(e) {
    // 1、获取到对应的字段，装配一个请求报文
    const { mobile, newPassword, vcode } = this.state;
    if (!mobile || !newPassword || !vcode) {
      return
    }
    const newInformation = {
      // 需要的一些注册信息
      mobile: mobile.startsWith('+')? mobile : '+86' + mobile,
      password: CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(newPassword)),
      verificationCode: vcode,
    }
    // 2、发送异步请求
    this.props.actions.changePassword(newInformation, (err, data) => {
      // 2.1、如果有异常，直接抛出来，或者是用一个toast把它提示出来
      if (err) {
        this.alert(err, 'Error')
      }
      // 2.2、如果正常返回，按照后续逻辑来处理
      else {
        sessionStorage.setItem('SALES_APP_PRODUCER', JSON.stringify(data.producer))
        sessionStorage.setItem('SALES_APP_MSG', data.msg)
        sessionStorage.setItem('SALES_APP_SIGN', data.sign)
        sessionStorage.setItem('SALES_APP_TENANT_CODE', data.tenantCode)
        sessionStorage.setItem('SALES_APP_FROM_LOGIN', "true")
        if (this.timer) {
          clearInterval(this.timer)
          this.timer = null
        }
        let redirectUrl = sessionStorage.getItem("SALES_APP_REDIRECT_URL")
        if (redirectUrl === "goBack") {
          browserHistory.goBack()
        } else if (redirectUrl) {
          browserHistory.replace(redirectUrl)
        } else {
          browserHistory.replace('/')
        }
      }
    });
  }
  sendSms(e) {
    const { mobile } = this.state;
    if (!mobile) {
      return
    }
    this.props.actions.sendSms(mobile.startsWith('+')? mobile : '+86' + mobile, (err, data) => {
      if (err) {
        this.alert(err, 'Error')
      } else {
        this.toast('The verification code is send to your mobile')
        this.setState({
          sendDisabled: true,
          coldSeconds: 60,
        })
        this.timer = setInterval(() => {
          let coldSeconds = this.state.coldSeconds
          if (coldSeconds > 0) {
            coldSeconds = coldSeconds - 1
            this.setState({ coldSeconds })
          } else {
            this.setState({ sendDisabled: false })
            if (this.timer) {
              clearInterval(this.timer)
              this.timer = null
            }
          }
        }, 1000)
      }
    });
  }

  back(e) {
    const { action } = this.props.location.query
    if (action === "changePassword") {
      browserHistory.goBack()
      return
    }
    this.showLoading()
    setTimeout(() => {
      this.setState({
        isRegister: false,
        forgotPassword: false,
      }, () => {
        this.hideLoading()
      })
    }, 500)
  }

  gotoRegister() {
    this.showLoading()
    setTimeout(() => {
      this.setState({
        forgotPassword: false,
        isRegister: true,
        vcode: '',
      }, () => {
        this.hideLoading()
      })
    }, 500)
  }

  gotoChangePassword() {
    this.showLoading()
    setTimeout(() => {
      this.setState({
        forgotPassword: true,
        isRegister: false,
        newPassword: '',
        vcode: '',
      }, () => {
        this.hideLoading()
      })
    }, 500)
  }

  renderContent() {
    return (
      <div className="h-100 d-flex flex-column justify-content-around login-background">
        <div className="container pt-3">
          <div className="row justify-content-sm-center">
            <div className="col-12 col-md-8 col-lg-4">
              {this.state.isRegister || this.state.forgotPassword ?
                <div className="card border-info text-center">
                  <div className="card-header">
                    <i className="fas fa-arrow-left float-left mt-1 text-primary" onClick={this.back.bind(this)} />
                    {this.state.forgotPassword ? 'Change password' : 'Welcome to'}
                  </div>
                  <div className="card-body">
                    <img src={require('../../../assets/eBaoCloud.png')} />
                    <h4 className="text-center mb-4">eBaoCloud</h4>
                    <form id="others" className="needs-validation" onSubmit={e => e.preventDefault()}>
                      <div className="input-group mb-2">
                        <input type="tel" className="form-control" placeholder="Mobile No."
                          required value={this.state.mobile}
                          onChange={e => this.setState({ mobile: e.target.value })} autoComplete="off" />
                        <div className="input-group-append">
                          <button className="btn btn-outline-secondary" type="button" onClick={this.sendSms.bind(this)}
                            disabled={this.state.sendDisabled}>Send {this.state.sendDisabled ? `(${this.state.coldSeconds})` : ''}
                          </button>
                        </div>
                      </div>
                      <input type="password" className="form-control mb-2"
                        placeholder={this.state.forgotPassword ? 'New Password' : 'Password'}
                        required value={this.state.newPassword}
                        onChange={e => this.setState({ newPassword: e.target.value })} autoComplete="off" />
                      <input type="text" className="form-control mb-2" placeholder="Verification Code"
                        required value={this.state.vcode}
                        onChange={e => this.setState({ vcode: e.target.value })} autoComplete="off" />
                      {!this.state.forgotPassword &&
                        <div className="custom-control custom-checkbox float-left mb-2">
                          <input type="checkbox" className="custom-control-input" id="remember-me"
                            checked={this.state.remember}
                            onChange={e => this.setState({ remember: e.target.checked })} />
                          <label className="custom-control-label" htmlFor="remember-me">Remember me</label>
                        </div>
                      }
                      {this.state.forgotPassword ?
                        <button className="btn btn-lg btn-primary btn-block mb-2" type="submit"
                          onClick={this.changePassword.bind(this)}><i className="fas fa-sign-in" />Submit
                        </button>
                        :
                        <button className="btn btn-lg btn-primary btn-block mb-2" type="submit"
                          onClick={this.register.bind(this)}><i className="fas fa-sign-in" />Register
                        </button>
                      }
                    </form>
                  </div>
                </div>
                :
                <div className="card border-info text-center">
                  <div className="card-header">
                    <i className="fas fa-arrow-left float-left mt-1 text-primary"
                       onClick={() => browserHistory.goBack()}  />
                    Sign in to continue
                  </div>
                  <div className="card-body">
                    <img src={require('../../../assets/eBaoCloud.png')} />
                    <h4 className="text-center mb-4">eBaoCloud</h4>
                    <form id="login" className="needs-validation" onSubmit={e => e.preventDefault()}>
                      <input type="text" className="form-control mb-2" placeholder="Mobile No."
                        required value={this.state.mobile}
                        onChange={e => this.setState({ mobile: e.target.value })} autoComplete="off" />
                      <input type="password" className="form-control mb-2" placeholder="Password" required
                        value={this.state.password} onChange={e => this.setState({ password: e.target.value })}
                        autoComplete="off" />
                      <div className="custom-control custom-checkbox float-left mb-2">
                        <input type="checkbox" className="custom-control-input" id="remember-me"
                          checked={this.state.remember}
                          onChange={e => this.setState({ remember: e.target.checked })} />
                        <label className="custom-control-label" htmlFor="remember-me">Remember me</label>
                      </div>
                      <button className="btn btn-lg btn-primary btn-block mb-2" type="submit"
                        onClick={this.login.bind(this)}><i className="fas fa-sign-in" />Sign in
                      </button>
                      <button type="button" className="btn btn-link float-left"
                        onClick={this.gotoRegister.bind(this)}>New customer?
                      </button>
                      <button type="button" className="btn btn-link float-right"
                        onClick={this.gotoChangePassword.bind(this)}>Forgot password?
                      </button>
                    </form>
                  </div>
                </div>
              }

            </div>
          </div>
        </div>
      </div>
    )
  }
}
