import * as t from './actionTypes'
import request from '../../../common/request'
import {requestData, receiveError} from '../../../common/actions'
import config from '../../../config'

//private actions start
function setPoliciesData (policiesData) {
  return {
    type: t.RECEIVE_POLICIES_DATA,
    policiesData,
    meta: {
      loading: false
    }
  }
}

//export actions start
export function setPoliciesModel (policiesModel) {
  return {
    type: t.SET_POLICIES_MODEL,
    policiesModel,
    meta: {
      loading: false
    }
  }
}

//export async actions start
export function getPoliciesData (policiesRequest, callback) {
  return (dispatch, getState) => {
    dispatch(requestData('getPoliciesData'))
    return request('/rest/policies', policiesRequest)
      .then(data => {
        dispatch(setPoliciesData(data))
        callback && callback(null, data)
      })
      .catch((err) => {
        console.log('server error', err)
        dispatch(receiveError(err.toString()))
        callback && callback(err.toString())
      })
  }
}
function setPolicyList(policyListData) {
  return {
    type: t.RECEIVE_POLICY_LIST_DATA,
    policyListData,
    meta: {
      loading: false
    }
  }
}
export function fetchPolicyList(callback) {
  return (dispatch, getState) => {
    dispatch(requestData('fetchPolicyList'))
    return request(config.bffServiceBase + `/policy/list?msg=${encodeURIComponent(sessionStorage.getItem("SALES_APP_MSG"))}&sign=${encodeURIComponent(sessionStorage.getItem("SALES_APP_SIGN"))}`)
      .then(data => {
        dispatch(setPolicyList(data))
        callback && callback(null, data)
      })
      .catch((err) => {
        console.log('server error', err)
        dispatch(receiveError(err.toString()))
        callback && callback(err.toString())
      })
  }
}
