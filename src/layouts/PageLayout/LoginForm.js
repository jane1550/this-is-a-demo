import React from 'react'
import PropTypes from 'prop-types'
import './LoginForm.scss'

export default class LoginForm extends React.Component {
  static propTypes = {
    onLogin: PropTypes.func
  }

  constructor (props) {
    super(props)
    this.state = {
      username: '',
      password: '',
    }
  }

  onSubmitClick (e) {
    let { username, password } = this.state
    let { onLogin } = this.props
    if (username && password) {
      onLogin && onLogin(username, password)
    }
  }

  onUsernameChange (username) {
    this.setState({ username })
  }

  onPasswordChange (password) {
    this.setState({ password })
  }

  render () {
    return (
      <div className="h-100 d-flex flex-column justify-content-around login-background">
        <div className="container pt-3">
          <div className="row justify-content-sm-center">
            <div className="col-12 col-md-8 col-lg-4">
              <div className="card border-info text-center">
                <div className="card-header">
                  Sign in to continue
                </div>
                <div className="card-body">
                  <img src={require('../../assets/eBaoCloud.png')}/>
                  <h4 className="text-center">eBaoCloud</h4>
                  <form className="needs-validation" onSubmit={e => e.preventDefault()}>
                    <input type="text" id="username" className="form-control mb-2" placeholder="Username / Mobile No." required
                           autoFocus
                           value={this.state.username} onChange={e => this.onUsernameChange(e.target.value)}/>
                    <input type="password" id="password" className="form-control mb-2" placeholder="Password" required
                           value={this.state.password} onChange={e => this.onPasswordChange(e.target.value)}/>
                    <div className="custom-control custom-checkbox float-left mb-2">
                      <input type="checkbox" className="custom-control-input" id="remember-me"/>
                      <label className="custom-control-label" htmlFor="remember-me">Remember me</label>
                    </div>
                    <button className="btn btn-lg btn-primary btn-block mb-2" type="submit"
                            onClick={this.onSubmitClick.bind(this)}><i className="fas fa-sign-in"/>Sign in
                    </button>
                    <button type="button" className="btn btn-link float-left">New customer?</button>
                    <button type="button" className="btn btn-link float-right">Forgot password?</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
