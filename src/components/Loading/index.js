/**
 * Created by haydn.chen on 3/26/2018.
 */
import React from 'react'
import PropTypes from 'prop-types'
import './Loading.scss'

export default class Loading extends React.Component {
  static propTypes = {
    show: PropTypes.bool,
    maskZIndex: PropTypes.number,
    spinnerZIndex: PropTypes.number,
    message: PropTypes.string,
  }

  static defaultProps = {
    show: false,
    maskZIndex: 1800,
    spinnerZIndex: 5000,
    message: 'Loading...'
  }

  render() {
    const {show, maskZIndex, spinnerZIndex, message} = this.props
    return (
      <div style={show? {} : {display: 'none'}}>
        <div className="loading-mask" style={{zIndex:maskZIndex}}/>
        <div className="loading-spinner" style={{zIndex:spinnerZIndex}}>
          <div><i className="loading-icon"/></div>
          <div>{message}</div>
        </div>
      </div>
    )
  }
}

