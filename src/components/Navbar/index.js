/**
 * Created by haydn.chen on 4/23/2018.
 */
import React from 'react'
import PropTypes from 'prop-types'
import {guid} from '../../common/utils'

export default class Navbar extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    children: PropTypes.node,
    theme: PropTypes.oneOf([
      'light',
      'dark',
    ]),
    bgColor: PropTypes.oneOf([
      'primary',
      'secondary',
      'success',
      'danger',
      'warning',
      'info',
      'light',
      'dark',
      'white',
    ]),
    brand: PropTypes.node,
    className: PropTypes.string,
    style: PropTypes.object,
  }

  static defaultProps = {
    theme: 'light',
    bgColor: 'light'
  }

  constructor(props) {
    super(props)
    this.id = this.props.id || guid()
  }

  render() {
    const {children, className, style, theme, bgColor, brand} = this.props
    const id = this.id
    let containerClass = "navbar navbar-expand-lg"
    if (theme) {
      containerClass += " navbar-" + theme
    }
    if (bgColor) {
      containerClass += " bg-" + bgColor
    }
    if (className) {
      containerClass += " " + className
    }
    return (
      <div id={id} className={containerClass} style={style}>
        {brand ? <a className="navbar-brand">{brand}</a> : null}
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target={"#"+id+"-content"}
                aria-controls={+id+"-content"} aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse justify-content-between" id={id+"-content"}>
          {children}
        </div>
      </div>
    )
  }
}