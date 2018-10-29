import {combineReducers} from 'redux'
import * as t from './actionTypes'

const initUiState = {
  meModel: null,
}

function ui(state = initUiState, action) {
  switch (action.type) {
    case t.SET_ME_MODEL:
      return Object.assign({}, state, {
        meModel: action.meModel,
      })
    default:
      return state
  }
}

const initDataState = {
  meData: null,
}

function data(state = initDataState, action) {
  switch (action.type) {
    case t.RECEIVE_ME_DATA:
      return Object.assign({}, state, {
        meData: action.meData,
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
