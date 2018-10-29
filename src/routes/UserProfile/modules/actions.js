import * as t from './actionTypes'
import request from '../../../common/request'
import {requestData, receiveError} from '../../../common/actions'
import config from '../../../config'

function sethandleSave(handelSaveData) {
  return {
    type: t.RECEIVE_HANDLE_SAVE_DATA,
    handelSaveData,
    meta: {
      loading: false
    }
  }
}

export function handleSave(reqBody, callback) {
  const SALES_APP_MSG = encodeURIComponent(sessionStorage.getItem('SALES_APP_MSG'))
  const SALES_APP_SIGN = encodeURIComponent(sessionStorage.getItem('SALES_APP_SIGN'))
  return (dispatch, getState) => {
    dispatch(requestData('handelSave'))
    return request(config.bffServiceBase + `/user/update?msg=${SALES_APP_MSG}&sign=${SALES_APP_SIGN}`, reqBody)
      .then(data => {
        dispatch(sethandleSave(data))
        callback && callback(null, data)
      })
      .catch((err) => {
        console.log('server error', err)
        dispatch(receiveError(err.toString()))
        callback && callback(err.toString())
      })
  }
}

export function verifyAgent(reqBody, callback) {
  const SALES_APP_MSG = encodeURIComponent(sessionStorage.getItem('SALES_APP_MSG'))
  const SALES_APP_SIGN = encodeURIComponent(sessionStorage.getItem('SALES_APP_SIGN'))
  return (dispatch, getState) => {
    dispatch(requestData('verifyAgent'))
    return request(config.bffServiceBase + `/user/agentValidate?msg=${SALES_APP_MSG}&sign=${SALES_APP_SIGN}`, reqBody)
      .then(data => {
        dispatch(sethandleSave(data))
        callback && callback(null, data)
      })
      .catch((err) => {
        console.log('server error', err)
        dispatch(receiveError(err.toString()))
        callback && callback(err.toString())
      })
  }
}
