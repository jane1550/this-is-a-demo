import * as t from './actionTypes'
import request from '../../../common/request'
import {requestData, receiveError} from '../../../common/actions'
import config from '../../../config'

//private actions start
function setProductListData (productListData) {
  return {
    type: t.RECEIVE_PRODUCTLIST_DATA,
    productListData,
    meta: {
      loading: false
    }
  }
}

//export actions start
export function setProductListModel (productListModel) {
  return {
    type: t.SET_PRODUCTLIST_MODEL,
    productListModel,
    meta: {
      loading: false
    }
  }
}

//export async actions start
export function getProductListData (productListRequest, callback) {
  return (dispatch, getState) => {
    dispatch(requestData('getProductListData'))
    return request('/rest/productList', productListRequest)
      .then(data => {
        dispatch(setProductListData(data))
        callback && callback(null, data)
      })
      .catch((err) => {
        console.log('server error', err)
        dispatch(receiveError(err.toString()))
        callback && callback(err.toString())
      })
  }
}
