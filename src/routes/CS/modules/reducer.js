import {combineReducers} from 'redux'
import * as t from './actionTypes'

const initUiState = {
  cSModel: null,
}

function ui(state = initUiState, action) {
  switch (action.type) {
    case t.SET_CS_MODEL:
      return Object.assign({}, state, {
        cSModel: action.cSModel,
      })
    default:
      return state
  }
}

const initDataState = {
  cSData: null,
}

function data(state = initDataState, action) {
  switch (action.type) {
    case t.RECEIVE_CS_DATA:
      return Object.assign({}, state, {
        cSData: action.cSData,
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
