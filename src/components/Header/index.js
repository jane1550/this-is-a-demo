/**
 * Created by haydn.chen on 4/4/2018.
 */
import React from 'react'
import PropTypes from 'prop-types'
import browserHistory from '../../common/history'

export default class Header extends React.Component {
  static propTypes = {
    title: PropTypes.node,
    leftComponent: PropTypes.node,
    rightComponent: PropTypes.node,
  }

  static defaultProps = {}

  render() {
    let {title, leftComponent, rightComponent} = this.props
    return (
      <div className="row text-center border m-0 bg-primary">
        <div className="col-2 col-lg-1 d-flex justify-content-around align-items-center p-0"><h2
          className="m-0 text-white">{leftComponent ? leftComponent :
          <i className="fa fa-chevron-left" onClick={e => browserHistory.goBack()}/>}</h2></div>
        <div className="flex-fill d-flex justify-content-around align-items-center p-0"><h3
          className="p-2 text-white">{title}</h3></div>
        <div className="col-2 col-lg-1 d-flex justify-content-around align-items-center p-0"><h2
          className="m-0 text-white">{rightComponent}</h2></div>
      </div>
    )
  }
}
