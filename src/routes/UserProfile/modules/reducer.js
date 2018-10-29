import { combineReducers } from 'redux'
import * as t from './actionTypes'

const initUiState = {
  userProfileModel: null,
  handelSaveModel: null,
}

function ui (state = initUiState, action) {
  switch (action.type) {
    case t.SET_USERPROFILE_MODEL:
      return Object.assign({}, state, {
        userProfileModel: action.userProfileModel,
      })
    case t.SET_HANDLE_SAVE_MODEL:
      return Object.assign({}, state, {
        handelSaveModel: action.handelSaveModel,
      })
    default:
      return state
  }
}

const initDataState = {
  userProfileData: null,
  handelSaveData: null,
}

function data (state = initDataState, action) {
  switch (action.type) {
    case t.RECEIVE_USERPROFILE_DATA:
      return Object.assign({}, state, {
        userProfileData: action.userProfileData,
      })
    case t.RECEIVE_HANDLE_SAVE_DATA:
      return Object.assign({}, state, {
        handelSaveData: action.handelSaveData,
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
