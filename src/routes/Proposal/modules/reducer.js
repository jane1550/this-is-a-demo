import {combineReducers} from 'redux'
import * as t from './actionTypes'

const initUiState = {
  plan: null,
  proposal: null,
  customer: null,
}

function ui(state = initUiState, action) {
  switch (action.type) {
    case t.RESET_PAGE:
      return initUiState
    case t.SET_PLAN:
      return Object.assign({}, state, {
        plan: action.plan,
      })
    case t.SET_PROPOSAL:
      return Object.assign({}, state, {
        proposal: action.proposal,
      })
    case t.SET_CUSTOMER:
      return Object.assign({}, state, {customer: action.customer})
    default:
      return state
  }
}

const initDataState = {
  packageCode: null,
  packageName: null,
  salesInsurer: null,
  salesProductConfigInfoList: [],
  suggestReason: '',
  ridersList: [],
  calcPremium: null,
  savePlan: null,
  proposalCode: null,
  customers: null,
  producer: null,
  quotePdfIndi: null,
  illusMap: {},
}

function data(state = initDataState, action) {
  switch (action.type) {
    case t.RESET_PAGE:
      return initDataState
    case t.RECEIVE_PLAN_INITIAL_DATA:
      return Object.assign({}, state, {
        packageCode: action.data.packageCode,
        packageName: action.data.packageName,
        salesInsurer: action.data.salesInsurer,
        salesProductConfigInfoList: action.data.salesProductConfigInfoList,
        suggestReason: action.data.suggestReason,
        quotePdfIndi: action.data.quotePdfIndi,
      })
    case t.RECEIVE_RIDERS_LIST:
      return Object.assign({}, state, {
        ridersList: action.ridersList,
      })
    case t.RECEIVE_CALC_PREMIUM:
      return Object.assign({}, state, {
        calcPremium: action.calcPremiumData,
      })
    case t.RECEIVE_SAVE_PLAN:
      return Object.assign({}, state, {
        savePlan: action.savePlan,
      })
    case t.RECEIVE_SAVE_PROPOSAL:
      return Object.assign({}, state, {
        saveProposal: action.saveProposal,
      })
    case t.RECEIVE_CUSTOMERS:
      return Object.assign({}, state, {
        customers: action.customers,
      })
    case t.RECEIVE_PLAN_ILLUSTRATION:
      return Object.assign({}, state, {
        illusMap: action.illusMap,
      })
    case t.SET_PRODUCER:
      return Object.assign({}, state, {producer: action.producer})
    default:
      return state
  }
}

const reducer = combineReducers({
  ui,
  data,
})

export default reducer
