import { combineReducers } from 'redux'
import * as t from './actionTypes'

const initUiState = {
  loginModel: null,
  userAuthModel: null,
  registerModel: null,
  sendSmsModel: null,
  changePasswordModel: null,
}

function ui(state = initUiState, action) {
  switch (action.type) {
    case t.SET_LOGIN_MODEL:
      return Object.assign({}, state, {
        loginModel: action.loginModel,
      })
    case t.SET_USER_AUTH_MODEL:
      return Object.assign({}, state, {
        userAuthModel: action.userAuthModel,
      })
    case t.SET_REGISTER_MODEL:
      return Object.assign({}, state, {
        registerModel: action.registerModel,
      })
    case t.SET_SEND_SMS_MODEL:
      return Object.assign({}, state, {
        sendSmsModel: action.sendSmsModel,
      })
    case t.SET_CHANGE_PASSWORD_MODEL:
      return Object.assign({}, state, {
        changePasswordModel: action.changePasswordModel,
      })

    default:
      return state
  }
}

const initDataState = {
  loginData: null,
  userAuth: null,
  registerData: null,
  sendSmsData: null,
  changePasswordData: null,
}

function data(state = initDataState, action) {
  switch (action.type) {
    case t.RECEIVE_LOGIN_DATA:
      return Object.assign({}, state, {
        loginData: action.loginData,
      })
    case t.RECEIVE_USER_AUTH_DATA:
      return Object.assign({}, state, {
        userAuth: action.userAuth,
      })
    case t.RECEIVE_REGISTER_DATA:
      return Object.assign({}, state, {
        registerData: action.registerData,
      })
    case t.RECEIVE_SEND_SMS_DATA:
      return Object.assign({}, state, {
        sendSmsData: action.sendSmsData,
      })
    case t.RECEIVE_CHANGE_PASSWORD_DATA:
      return Object.assign({}, state, {
        changePasswordData: action.changePasswordData,
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
