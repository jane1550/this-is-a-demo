import {combineReducers} from 'redux'
import * as t from './actionTypes'

const initUiState = {
  homeModel: null,
}

function ui(state = initUiState, action) {
  switch (action.type) {
    case t.SET_HOME_MODEL:
      return Object.assign({}, state, {
        homeModel: action.homeModel,
      })
    default:
      return state
  }
}

const initDataState = {
  homeData: null,
}

function data(state = initDataState, action) {
  switch (action.type) {
    case t.RECEIVE_HOME_DATA:
      return Object.assign({}, state, {
        homeData: action.homeData,
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
