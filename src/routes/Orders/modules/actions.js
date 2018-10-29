import * as t from './actionTypes'
import request from '../../../common/request'
import {requestData, receiveError} from '../../../common/actions'
import config from '../../../config'

//private actions start
function setOrdersData(ordersData) {
  return {
    type: t.RECEIVE_ORDERS_DATA,
    ordersData,
    meta: {
      loading: false
    }
  }
}

//export actions start
export function setOrdersModel(ordersModel) {
  return {
    type: t.SET_ORDERS_MODEL,
    ordersModel,
    meta: {
      loading: false
    }
  }
}

//export async actions start
export function getOrdersData(ordersRequest, callback) {
  return (dispatch, getState) => {
    dispatch(requestData('getOrdersData'))
    return request('/rest/orders', ordersRequest)
      .then(data => {
        dispatch(setOrdersData(data))
        callback && callback(null, data)
      })
      .catch((err) => {
        console.log('server error', err)
        dispatch(receiveError(err.toString()))
        callback && callback(err.toString())
      })
  }
}

function setProposalList(proposalListData) {
  return {
    type: t.RECEIVE_PROPOSAL_LIST_DATA,
    proposalListData,
    meta: {
      loading: false
    }
  }
}

export function fetchProposalList(callback) {
  return (dispatch, getState) => {
    dispatch(requestData('fetchProposalList'))
    return request(config.bffServiceBase + `/proposal/list?msg=${encodeURIComponent(sessionStorage.getItem("SALES_APP_MSG"))}&sign=${encodeURIComponent(sessionStorage.getItem("SALES_APP_SIGN"))}`)
      .then(data => {
        dispatch(setProposalList(data))
        callback && callback(null, data)
      })
      .catch((err) => {
        console.log('server error', err)
        dispatch(receiveError(err.toString()))
        callback && callback(err.toString())
      })
  }
}
