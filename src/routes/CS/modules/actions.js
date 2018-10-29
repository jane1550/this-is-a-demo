import * as t from './actionTypes'
import request from '../../../common/request'
import {requestData, receiveError} from '../../../common/actions'
import config from '../../../config'

//private actions start
function setCSData (cSData) {
  return {
    type: t.RECEIVE_CS_DATA,
    cSData,
    meta: {
      loading: false
    }
  }
}

//export actions start
export function setCSModel (cSModel) {
  return {
    type: t.SET_CS_MODEL,
    cSModel,
    meta: {
      loading: false
    }
  }
}

//export async actions start
export function getCSData (cSRequest, callback) {
  return (dispatch, getState) => {
    dispatch(requestData('getCSData'))
    return request('/rest/cS', cSRequest)
      .then(data => {
        dispatch(setCSData(data))
        callback && callback(null, data)
      })
      .catch((err) => {
        console.log('server error', err)
        dispatch(receiveError(err.toString()))
        callback && callback(err.toString())
      })
  }
}
