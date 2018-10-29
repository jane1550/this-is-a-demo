import * as t from './actionTypes'
import request from '../../../common/request'
import {requestData, receiveError} from '../../../common/actions'
import config from '../../../config'

//private actions start
function setClaimData (claimData) {
  return {
    type: t.RECEIVE_CLAIM_DATA,
    claimData,
    meta: {
      loading: false
    }
  }
}

//export actions start
export function setClaimModel (claimModel) {
  return {
    type: t.SET_CLAIM_MODEL,
    claimModel,
    meta: {
      loading: false
    }
  }
}

//export async actions start
export function getClaimData (claimRequest, callback) {
  return (dispatch, getState) => {
    dispatch(requestData('getClaimData'))
    return request('/rest/claim', claimRequest)
      .then(data => {
        dispatch(setClaimData(data))
        callback && callback(null, data)
      })
      .catch((err) => {
        console.log('server error', err)
        dispatch(receiveError(err.toString()))
        callback && callback(err.toString())
      })
  }
}
