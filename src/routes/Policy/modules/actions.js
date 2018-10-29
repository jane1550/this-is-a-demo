import * as t from './actionTypes'
import request from '../../../common/request'
import {requestData, receiveError} from '../../../common/actions'
import config from '../../../config'

//private actions start
function setPolicyData(policyData) {
  return {
    type: t.RECEIVE_POLICY_DATA,
    policyData,
    meta: {
      loading: false
    }
  }
}

//export actions start
export function setPolicyModel(policyModel) {
  return {
    type: t.SET_POLICY_MODEL,
    policyModel,
    meta: {
      loading: false
    }
  }
}

//export async actions start
export function getPolicyData(insurerCode, policyCode, callback) {
  return (dispatch, getState) => {
    dispatch(requestData('getPolicyData'))
    return request(config.bffServiceBase + `/policy/getFromeLi/${insurerCode}/${policyCode}?msg=${encodeURIComponent(sessionStorage.getItem("SALES_APP_MSG"))}&sign=${encodeURIComponent(sessionStorage.getItem("SALES_APP_SIGN"))}`)
      .then(data => {
        dispatch(setPolicyData(data))
        callback && callback(null, data)
      })
      .catch((err) => {
        console.log('server error', err)
        dispatch(receiveError(err.toString()))
        callback && callback(err.toString())
      })
  }
}
