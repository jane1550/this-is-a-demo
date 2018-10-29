/**
 * Created by haydn.chen on 3/28/2018.
 */
import React from 'react'
import PropTypes from 'prop-types'
import {guid} from '../../common/utils'

export default class Modal extends React.Component {
  static propTypes = {
    id: PropTypes.string,
  }

  constructor(props) {
    super(props)
    this.id = this.props.id || guid()
    this.state = {
      title: null,
      content: '',
    }
  }

  show(content, title = null) {
    this.setState({content, title}, ()=> {
      $('#' + this.id).modal('show')
    })
  }

  hide() {
    $('#' + this.id).modal('hide')
  }

  render() {
    const {content, title} = this.state
    const id = this.id
    return (
      <div className="modal fade bd-example-modal-lg" id={id} tabIndex="-1" role="dialog" aria-labelledby={id+"-title"}
           aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            {title &&
            <div className="modal-header bg-light p-2 p-sm-3">
              <h5 className="modal-title" id={id+"-title"}>{title}</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            }
            <div className="modal-body">
              {content}
            </div>
          </div>
        </div>
      </div>
    )
  }
}