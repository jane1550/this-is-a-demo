import {combineReducers} from 'redux'
import * as t from './actionTypes'

const initUiState = {
  policyModel: null,
}

function ui(state = initUiState, action) {
  switch (action.type) {
    case t.SET_POLICY_MODEL:
      return Object.assign({}, state, {
        policyModel: action.policyModel,
      })
    default:
      return state
  }
}

const initDataState = {
  policyData: null,
}

function data(state = initDataState, action) {
  switch (action.type) {
    case t.RECEIVE_POLICY_DATA:
      return Object.assign({}, state, {
        policyData: action.policyData,
      })
    default:
      return state
  }
}

const reducer = combineReducers({
  ui,
  data,
})

export default reducer
