import {combineReducers} from 'redux'
import * as t from './actionTypes'

const initUiState = {
  policiesModel: null,
  policyListModel: null,
}

function ui(state = initUiState, action) {
  switch (action.type) {
    case t.SET_POLICIES_MODEL:
      return Object.assign({}, state, {
        policiesModel: action.policiesModel,
      })
      case t.SET_POLICY_LIST_MODEL:
      return Object.assign({}, state, {
        policyListModel: action.policyListModel,
      })
    default:
      return state
  }
}

const initDataState = {
  policiesData: null,
}

function data(state = initDataState, action) {
  switch (action.type) {
    case t.RECEIVE_POLICIES_DATA:
      return Object.assign({}, state, {
        policiesData: action.policiesData,
      })
      case t.RECEIVE_POLICY_LIST_DATA:
      return Object.assign({}, state, {
        policyListData: action.policyListData,
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
