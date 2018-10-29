/**
 * Created by haydn.chen on 3/27/2018.
 */
import React from 'react'
import PropTypes from 'prop-types'
import {guid} from '../../common/utils'

export default class Confirm extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    cancelButtonText: PropTypes.string,
    confirmButtonText: PropTypes.string,
  }

  static defaultProps = {
    cancelButtonText: 'Cancel',
    confirmButtonText: 'OK',
  }

  constructor(props) {
    super(props)
    this.id = this.props.id || guid()
    this.state = {
      title: null,
      message: '',
      confirmCallback: null,
      cancelCallback: null,
    }
  }

  show(message, title = null, confirmCallback = null, cancelCallback = null) {
    this.setState({message, title, confirmCallback, cancelCallback}, () => {
      $('#' + this.id).modal('show')
    })
  }

  onCancel() {
    let {cancelCallback} = this.state
    cancelCallback && cancelCallback()
  }

  onConfirm() {
    let {confirmCallback} = this.state
    confirmCallback && confirmCallback()
  }

  render() {
    let {cancelButtonText, confirmButtonText} = this.props
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
              <button type="button" className="btn btn-secondary w-25" data-dismiss="modal"
                      onClick={e => this.onCancel()}>{cancelButtonText}</button>
              <button type="button" className="btn btn-primary w-25" data-dismiss="modal"
                      onClick={e => this.onConfirm()}>{confirmButtonText}</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
