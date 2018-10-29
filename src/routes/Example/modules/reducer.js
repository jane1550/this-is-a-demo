import { combineReducers } from 'redux'
import * as t from './actionTypes'

const initUiState = {

}

function ui(state = initUiState, action) {
  switch (action.type) {
    case t.SET_HOME_MODEL:
      return Object.assign({}, state, {
        proposal: action.homeModel,
      })
    default:
      return state
  }
}

const initDataState = {

}
function data(state = initDataState, action) {
  switch (action.type) {
    default:
      return state
  }
}

const reducer = combineReducers({
  ui,
  data,
})

export default reducer
