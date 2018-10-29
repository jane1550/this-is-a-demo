/**
 * Created by haydn.chen on 3/27/2018.
 */
import React from 'react'
import PropTypes from 'prop-types'
import {guid} from '../../common/utils'
import SignatureCanvas from 'react-signature-canvas'
import './Signature.scss'

export default class Signature extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    resetButtonText: PropTypes.string,
    cancelButtonText: PropTypes.string,
    okButtonText: PropTypes.string,
    value: PropTypes.string, // base64 format url
    onChange: PropTypes.func,
    title: PropTypes.node,
    canvasProps: PropTypes.string,
    readOnly: PropTypes.bool,
    className: PropTypes.string,
    style: PropTypes.object,
  }

  static defaultProps = {
    cancelButtonText: 'Cancel',
    okButtonText: 'OK',
    resetButtonText: 'Reset',
  }

  constructor(props) {
    super(props)
    this.id = this.props.id || guid()
    this.state = {
      value: this.props.value,
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value) {
      this.setState({value: nextProps.value});
    }
  }

  saveSignature() {
    let value = this.refs.sigPad.getCanvas().toDataURL();
    this.setState({value}, ()=>this.props.onChange && this.props.onChange(this.state.value));
  }

  showSignature() {
    if (this.props.readOnly) {
      return;
    }
    this.refs.sigPad.clear()
    $('#' + this.id + "-dialog").modal('show')
  }

  render() {
    let {cancelButtonText, okButtonText, resetButtonText, title, canvasProps, className, style} = this.props
    const id = this.id
    let containerClass = "signature-block p-3"
    if (className) {
      containerClass += " " + className
    }
    return (
      <div className={containerClass} id={id} style={style}>
        <div className="modal fade" id={id + "-dialog"} tabIndex="-1" role="dialog" aria-labelledby={id+"-dialog-title"}
             aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              {title &&
              <div className="modal-header">
                <h5 className="modal-title" id={id+"-dialog-title"}>Please sign here</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              }
              <div className="modal-body">
                <div className="signature-box">
                  <SignatureCanvas dotSize={2}
                                   canvasProps={canvasProps || {width:window.innerWidth * 0.85 < 450? window.innerWidth * 0.85 : 450, height:window.innerHeight * 0.25}}
                                   ref="sigPad"/>
                </div>
              </div>
              <div className="modal-footer justify-content-around">
                <button type="button" className="btn btn-secondary w-25"
                        onClick={() => this.refs.sigPad.clear()}>{resetButtonText}</button>
                <button type="button" className="btn btn-secondary w-25"
                        data-dismiss="modal">{cancelButtonText}</button>
                <button type="button" className="btn btn-primary w-25" data-dismiss="modal"
                        onClick={this.saveSignature.bind(this)}>{okButtonText}</button>
              </div>
            </div>
          </div>
        </div>
        <h5 className="signature-title ml-2">{title}</h5>
        <div className="signature-content" onClick={this.showSignature.bind(this)}>
          {this.state.value && <img className="w-100 h-100" src={this.state.value}/>}
        </div>
      </div>
    )
  }
}