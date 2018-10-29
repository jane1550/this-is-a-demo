/**
 * Created by haydn.chen on 3/29/2018.
 */
import React from 'react'
import PropTypes from 'prop-types'
import {guid} from '../../common/utils'

export default class NavPill extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    defaultActiveIndex: PropTypes.number,
    tabTitles: PropTypes.array,
    tabContents: PropTypes.array,
    onActiveIndexChange: PropTypes.func,
    className: PropTypes.string,
    style: PropTypes.object,
  }

  static defaultProps = {
    defaultActiveIndex: 0,
    tabTitles: [],
    tabContents: [],
  }

  constructor(props) {
    super(props)
    this.id = this.props.id || guid()
    this.state = {
      activeIndex: this.props.defaultActiveIndex || 0
    }
  }

  getActiveIndex() {
    return this.state.activeIndex
  }

  onTabClick(index) {
    const {onActiveIndexChange} = this.props
    let prevActiveIndex = this.state.activeIndex
    this.setState({activeIndex: index}, ()=> {
      onActiveIndexChange && onActiveIndexChange(this.state.activeIndex, prevActiveIndex)
    })
  }

  render() {
    const {tabTitles, tabContents, className, style} = this.props
    const {activeIndex} = this.state
    const id = this.id
    let containerClass = "m-2"
    if (className) {
      containerClass += " " + className
    }
    return (
      <div className={containerClass} style={style}>
        <ul className="nav nav-pills nav-justified border-bottom" id={id} role="tablist">
          {tabTitles.map((tabTitle, index)=>
            <li key={id + '-tab_' + index} className="nav-item" onClick={e=>this.onTabClick(index)}>
              <a className={"nav-link" + (index === activeIndex? " active" : "")} id={id + '-tab_' + index}
                 data-toggle="tab" href={"#" + id + '-tab-content_' + index} role="tab"
                 aria-controls={id + '-tab-content_' + index} aria-selected={index === activeIndex}>{tabTitle}</a>
            </li>
          )}
        </ul>
        <div className="tab-content" id={id + '-tab-content'}>
          {tabContents.map((tabContent, index)=>
            <div key={id + '-tab-content_' + index}
                 className={"tab-pane fade p-2" + (index === activeIndex? " show active" : "")}
                 id={id + '-tab-content_' + index} role="tabpanel"
                 aria-labelledby={id + '-tab_' + index}>{tabContent}</div>
          )}
        </div>
      </div>
    )
  }
}