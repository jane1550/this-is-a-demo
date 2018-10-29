import * as t from './actionTypes'
import request from '../../../common/request'
import {requestData, receiveError} from '../../../common/actions'
import config from '../../../config'

//private actions start
function setQuotationsData (quotationsData) {
  return {
    type: t.RECEIVE_QUOTATIONS_DATA,
    quotationsData,
    meta: {
      loading: false
    }
  }
}

//export actions start
export function setQuotationsModel (quotationsModel) {
  return {
    type: t.SET_QUOTATIONS_MODEL,
    quotationsModel,
    meta: {
      loading: false
    }
  }
}

//export async actions start
export function getQuotationsData (quotationsRequest, callback) {
  return (dispatch, getState) => {
    dispatch(requestData('getQuotationsData'))
    return request('/rest/quotations', quotationsRequest)
      .then(data => {
        dispatch(setQuotationsData(data))
        callback && callback(null, data)
      })
      .catch((err) => {
        console.log('server error', err)
        dispatch(receiveError(err.toString()))
        callback && callback(err.toString())
      })
  }
}
function setQuotationList(quotationListData) {
  return {
    type: t.RECEIVE_QUOTATION_LIST_DATA,
    quotationListData,
    meta: {
      loading: false
    }
  }
}

export function fetchQuotationList(callback) {
  return (dispatch, getState) => {
    dispatch(requestData('fetchQuotationList'))
    return request(config.bffServiceBase + `/plan/list?msg=${encodeURIComponent(sessionStorage.getItem("SALES_APP_MSG"))}&sign=${encodeURIComponent(sessionStorage.getItem("SALES_APP_SIGN"))}`)
      .then(data => {
        dispatch(setQuotationList(data))
        callback && callback(null, data)
      })
      .catch((err) => {
        console.log('server error', err)
        dispatch(receiveError(err.toString()))
        callback && callback(err.toString())
      })
  }
}



