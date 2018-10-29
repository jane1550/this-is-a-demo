import * as t from './actionTypes'
import request from '../../../common/request'
import {requestData, receiveError} from '../../../common/actions'
import config from '../../../config'

//private actions start
function setMeData (meData) {
  return {
    type: t.RECEIVE_ME_DATA,
    meData,
    meta: {
      loading: false
    }
  }
}

//export actions start
export function setMeModel (meModel) {
  return {
    type: t.SET_ME_MODEL,
    meModel,
    meta: {
      loading: false
    }
  }
}

//export async actions start
export function getMeData (meRequest, callback) {
  return (dispatch, getState) => {
    dispatch(requestData('getMeData'))
    return request('/rest/me', meRequest)
      .then(data => {
        dispatch(setMeData(data))
        callback && callback(null, data)
      })
      .catch((err) => {
        console.log('server error', err)
        dispatch(receiveError(err.toString()))
        callback && callback(err.toString())
      })
  }
}
