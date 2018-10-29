/**
 * Created by haydn.chen on 3/27/2018.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { guid } from '../../common/utils'

export default class Toast extends React.Component {
  static propTypes = {
    id: PropTypes.string,
  }

  static defaultProps = {}

  constructor (props) {
    super(props)
    this.id = this.props.id || guid()
    this.state = {
      message: '',
      alertClass: 'alert-primary',
      top: '-40%',
    }
  }

  show (message, type = 'info', duration = 1500, top = '40%') {
    let alertClass = 'alert-success'
    if (type === 'error') {
      alertClass = 'alert-danger'
    } else if (type === 'warning') {
      alertClass = 'alert-warning'
    } else if (type === 'success') {
      alertClass = 'alert-success'
    }
    this.setState({ message, alertClass, top }, () => {
      $('#' + this.id).addClass('show')
      setTimeout(() => {
        $('#' + this.id).removeClass('show')
        this.setState({ top: '-40%' })
      }, duration)
    })
  }

  close () {
    $('#' + this.id).removeClass('show')
    this.setState({ top: '-40%' })
  }

  render () {
    const { message, alertClass, top } = this.state
    const id = this.id
    return (
      <div id={id} className="d-flex justify-content-around fixed-top fade" style={{ top }}>
        <div className={'col-md-8 col-lg-4 alert alert-dismissible m-4 ' + alertClass} role="alert">
          <strong>{message}</strong>
          <button type="button" className="close" onClick={this.close.bind(this)}>
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      </div>
    )
  }
}
