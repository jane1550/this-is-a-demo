/**
 * Created by haydn.chen on 3/20/2018.
 */
import React from 'react'
import PropTypes from 'prop-types'
import './Forms.scss'
import {guid} from '../../common/utils'

export default class FormField extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    label: PropTypes.node,
    required: PropTypes.bool,
    hidden: PropTypes.bool,
    children: PropTypes.node,
    inline: PropTypes.bool,
    colSize: PropTypes.oneOf([
      "small",
      "middle",
      "large",
      "full",
    ]),
    tooltip: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
  }

  static defaultProps = {
    required: false,
    hidden: false,
    colSize: "large",
  }

  constructor(props) {
    super(props)
    this.id = this.props.id || guid()
    this.tooltipId = guid()
    this.state = {
      inline: typeof this.props.inline === "boolean" ? this.props.inline : window.innerWidth >= 375,
    }
  }

  componentWillReceiveProps(nextProps) {
    if (typeof nextProps.inline === "boolean") {
      this.setState({inline: nextProps.inline})
    }
  }

  componentDidMount() {
    if (this.props.tooltip) {
      $("#" + this.tooltipId).tooltip()
    }
  }

  render() {
    const {inline} = this.state
    const {label, required, hidden, children, colSize, tooltip, className, style} = this.props
    const id = this.id
    const tooltipId = this.tooltipId
    let containerClass = "d-flex border-bottom p-0"
    if (hidden) {
      containerClass += " hidden"
    }
    if (colSize === "small") {
      containerClass += " col-6 col-sm-6 col-md-3"
    } else if (colSize === "middle") {
      containerClass += " col-12 col-sm-6 col-md-4"
    } else if (colSize === "large") {
      containerClass += " col-12 col-md-6"
    } else {
      containerClass += " col-12"
    }
    if (className) {
      containerClass += " " + className
    }
    return (
      <div ref="formField" className={containerClass} style={style}>
        {label ?
          <div className="form-group row w-100 pt-2 pb-2 m-0 align-items-center">
            <label htmlFor={id}
                   className={"col-form-label pre-wrap" + (inline? " col-4" : " col-12")}>
              {label}
              {required && <span className="text-danger ml-1 mr-1">*</span>}
              {tooltip &&
              <i id={tooltipId} className="ml-1 mr-1 fas fa-question-circle text-warning" data-toggle="tooltip"
                 data-placement="top" data-html="true" title={tooltip}/>}
            </label>
            <div className={inline? "col-8" : "col-12"}>
              {children}
            </div>
          </div>
          :
          <div className="form-group row w-100 pt-2 pb-2 m-0 align-items-center">
            {required && <label htmlFor={id} className="col-form-label text-danger ml-1 mr-1">*</label>}
            {tooltip &&
            <i id={tooltipId} className="ml-1 mr-1 fas fa-question-circle text-warning" data-toggle="tooltip"
               data-placement="top" data-html="true" title={tooltip}/>}
            {(required || tooltip) ?
              <div className="flex-fill">
                {children}
              </div>
              :
              <div className="col-12">
                {children}
              </div>
            }
          </div>
        }
      </div>
    )
  }
}
