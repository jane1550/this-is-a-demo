/**
 * Created by haydn.chen on 3/29/2018.
 */
import React from 'react'
import PropTypes from 'prop-types'
import {guid} from '../../common/utils'

export default class SearchBar extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    onSearch: PropTypes.func,
    placeholder: PropTypes.string,
    suggestList: PropTypes.array,
    disabled: PropTypes.bool,
    readOnly: PropTypes.bool,
  }

  static defaultProps = {
    disabled: false,
    readOnly: false,
    placeholder: 'Search',
  }

  constructor(props) {
    super(props)
    this.id = this.props.id || guid()
    this.state = {
      value: this.props.value || '',
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({value: nextProps.value || ''})
  }

  onInputChange(value) {
    const {onChange, disabled, readOnly} = this.props
    if (disabled || readOnly) {
      return
    }
    this.setState({value}, ()=> {
      onChange && onChange(this.state.value)
    })
  }

  onInputBlur(value) {
    const {onBlur} = this.props
    onBlur && onBlur(this.state.value)
  }

  onInputFocus(e) {
    const {onFocus} = this.props
    onFocus && onFocus(e)
  }

  onSearchClick() {
    const {onSearch, disabled, readOnly} = this.props
    if (disabled || readOnly) {
      return
    }
    onSearch && onSearch(this.state.value)
  }

  render() {
    const {placeholder, disabled, readOnly} = this.props
    const id = this.id
    return (
      <div className="input-group p-2">
        <input id={id} className="form-control" type="search"
               placeholder={placeholder} value={this.state.value} onChange={e=>this.onInputChange(e.target.value)}
               onBlur={e=>this.onInputBlur(e.target.value)} onFocus={e=>this.onInputFocus(e)} disabled={disabled}
               readOnly={readOnly}/>
        <div className="input-group-append">
          <button className="fas fa-search btn btn-outline-secondary" onClick={()=>this.onSearchClick()}
                  disabled={disabled}/>
        </div>
      </div>
    )
  }
}