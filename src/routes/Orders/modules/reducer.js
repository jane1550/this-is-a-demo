import {combineReducers} from 'redux'
import * as t from './actionTypes'

const initUiState = {
  ordersModel: null,
  proposalListModel: null,
}

function ui(state = initUiState, action) {
  switch (action.type) {
    case t.SET_ORDERS_MODEL:
      return Object.assign({}, state, {
        ordersModel: action.ordersModel,
      })
      case t.SET_PROPOSAL_LIST_MODEL:
      return Object.assign({}, state, {
        proposalListModel: action.proposalListModel,
      })
    default:
      return state
  }
}

const initDataState = {
  ordersData: null,
  proposalListData:null,
}

function data(state = initDataState, action) {
  switch (action.type) {
    case t.RECEIVE_ORDERS_DATA:
      return Object.assign({}, state, {
        ordersData: action.ordersData,
      })
      case t.RECEIVE_PROPOSAL_LIST_DATA:
      return Object.assign({}, state, {
        proposalListData: action.proposalListData,
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
