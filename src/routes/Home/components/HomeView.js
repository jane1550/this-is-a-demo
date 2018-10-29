import React from 'react'
import PropTypes from 'prop-types'
import './HomeView.scss'
import browserHistory from '../../../common/history'

export default class HomeView extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    return (
      <div style={{ height: '100%' }}>
        <button onClick={() => browserHistory.push('/example?lang=zh-CN')}>Example</button>
      </div>
    )
  }
}
