import {combineReducers} from 'redux'
import * as t from './actionTypes'

const initUiState = {}

function ui(state = initUiState, action) {
  switch (action.type) {
    default:
      return state
  }
}

const initDataState = {
  plan: null,
  salesPackageInfo: null,
  liabilitiesMap: {},
  funds: [],
  illusMap: {},
  docId: null,
  docName: null,
}

function data(state = initDataState, action) {
  switch (action.type) {
    case t.RECEIVE_PLAN:
      return Object.assign({}, state, {
        plan: action.plan,
        salesPackageInfo: null,
        liabilitiesMap: {},
        funds: [],
        illusMap: {},
      })
    case t.RECEIVE_PACKAGE_DETAIL:
      return Object.assign({}, state, {
        salesPackageInfo: action.salesPackageInfo,
      })
    case t.RECEIVE_PRODUCTS_LIABS:
      return Object.assign({}, state, {
        liabilitiesMap: action.liabilitiesMap,
        funds: action.funds,
      })
    case t.RECEIVE_PLAN_ILLUSTRATION:
      return Object.assign({}, state, {
        illusMap: action.illusMap,
      })
    case t.RECEIVE_DOC_ID:
      return Object.assign({}, state, {
        docId: action.docId,
        docName: action.docName,
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
