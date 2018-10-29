import * as t from './actionTypes'
import request from '../../../common/request'
import { requestData, receiveError } from '../../../common/actions'
import config from '../../../config'

// 登录授权
function setUserAuth(userAuthData) {
  return {
    type: t.RECEIVE_USER_AUTH_DATA,
    userAuthData,
    meta: {
      loading: false
    }
  }
}

export function fecthUserAuth(reqBody, callback) {
  return (dispatch, getState) => {
    dispatch(requestData('fecthUserAuth'))
    return request(config.bffServiceBase + '/user/login', reqBody)
      .then(data => {
        dispatch(setUserAuth(data))
        callback && callback(null, data)
      })
      .catch((err) => {
        console.log('server error', err)
        dispatch(receiveError(err.toString()))
        callback && callback(err.toString())
      })
  }
}

// 注册
function setRegister(registerData) {
  return {
    type: t.RECEIVE_REGISTER_DATA,
    registerData,
    meta: {
      loading: false
    }
  }
}
export function register(registryForm, callback) {
  return (dispatch, getState) => {
    dispatch(requestData('register'))
    return request(config.bffServiceBase + '/user/register', registryForm)
      .then(data => {
        dispatch(setRegister(data))
        callback && callback(null, data)
      })
      .catch((err) => {
        console.log('server error', err)
        dispatch(receiveError(err.toString()))
        callback && callback(err.toString())
      })
  }

}

// SMS
function setSendSms(sendSmsData) {
  return {
    type: t.RECEIVE_SEND_SMS_DATA,
    sendSmsData,
    meta: {
      loading: false
    }
  }
}

export function sendSms(mobile, callback) {
  return (dispatch, getState) => {
    dispatch(requestData('sendSms'))
    return request(config.bffServiceBase + '/user/sendCode?mobile=' + encodeURIComponent(mobile), {})
      .then(data => {
        dispatch(setSendSms(data))
        callback && callback(null, data)
      })
      .catch((err) => {
        console.log('server error', err)
        dispatch(receiveError(err.toString()))
        callback && callback(err.toString())
      })
  }
}
function setChangePassword(ChangePasswordData) {
  return {
    type: t.RECEIVE_CHANGE_PASSWORD_DATA,
    ChangePasswordData,
    meta: {
      loading: false
    }
  }
}
export function changePassword(newInformation, callback) {
  return (dispatch, getState) => {
    dispatch(requestData('changePassword'))
    return request(config.bffServiceBase + '/user/chgPassword', newInformation)
      .then(data => {
        dispatch(setChangePassword(data))
        callback && callback(null, data)
      })
      .catch((err) => {
        console.log('server error', err)
        dispatch(receiveError(err.toString()))
        callback && callback(err.toString())
      })
  }
}
