import {combineReducers} from 'redux'
import * as t from './actionTypes'

const initUiState = {
  quotationsModel: null,
  quotationListModel: null,
}

function ui(state = initUiState, action) {
  switch (action.type) {
    case t.SET_QUOTATIONS_MODEL:
      return Object.assign({}, state, {
        quotationsModel: action.quotationsModel,
      })
      case t.SET_QUOTATION_LIST_MODEL:
      return Object.assign({}, state, {
        quotationListModel: action.quotationListModel,
      })
    default:
      return state
  }
}

const initDataState = {
  quotationsData: null,
  quotationListData: null,
}

function data(state = initDataState, action) {
  switch (action.type) {
    case t.RECEIVE_QUOTATIONS_DATA:
      return Object.assign({}, state, {
        quotationsData: action.quotationsData,
      })
      case t.RECEIVE_QUOTATION_LIST_DATA:
      return Object.assign({}, state, {
        quotationListData: action.quotationListData,
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
