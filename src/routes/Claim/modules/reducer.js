import {combineReducers} from 'redux'
import * as t from './actionTypes'

const initUiState = {
  claimModel: null,
}

function ui(state = initUiState, action) {
  switch (action.type) {
    case t.SET_CLAIM_MODEL:
      return Object.assign({}, state, {
        claimModel: action.claimModel,
      })
    default:
      return state
  }
}

const initDataState = {
  claimData: null,
}

function data(state = initDataState, action) {
  switch (action.type) {
    case t.RECEIVE_CLAIM_DATA:
      return Object.assign({}, state, {
        claimData: action.claimData,
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
