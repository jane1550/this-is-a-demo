/**
 * Created by haydn.chen on 3/27/2018.
 */
import React from 'react'
import PropTypes from 'prop-types'
import {guid} from '../../common/utils'

export default class Alert extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    okButtonText: PropTypes.string,
  }

  static defaultProps = {
    okButtonText: 'OK',
  }

  constructor(props) {
    super(props)
    this.id = this.props.id || guid()
    this.state = {
      title: null,
      message: ''
    }
  }

  show(message = null, title = null) {
    this.setState({message, title}, () => {
      $('#' + this.id).modal('show')
    })
  }

  render() {
    let {okButtonText} = this.props
    const {message, title} = this.state
    const id = this.id
    return (
      <div className="modal fade" id={id} tabIndex="-1" role="dialog" aria-labelledby={id + "-title"}
           aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            {title &&
            <div className="modal-header">
              <h5 className="modal-title" id={id + "-title"}>{title}</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            }
            {message &&
            <div className="modal-body">
              {message}
            </div>
            }
            <div className="modal-footer justify-content-around">
              <button type="button" className="btn btn-primary w-25" data-dismiss="modal">{okButtonText}</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
