import * as t from './actionTypes'
import request from '../../../common/request'
import {requestData, receiveError} from '../../../common/actions'
import config from '../../../config'

//private actions start
function setProductData (productData) {
  return {
    type: t.RECEIVE_PRODUCT_DATA,
    productData,
    meta: {
      loading: false
    }
  }
}

//export actions start
export function setProductModel (productModel) {
  return {
    type: t.SET_PRODUCT_MODEL,
    productModel,
    meta: {
      loading: false
    }
  }
}

//export async actions start
export function getProduct (reqBody, callback) {
  return (dispatch, getState) => {
    dispatch(requestData('getProduct'))
    return request(config.bffServiceBase + '/sales/package/getDetail', reqBody)
      .then(data => {
        dispatch(setProductData(data))
        callback && callback(null, data)
      })
      .catch((err) => {
        console.log('server error', err)
        dispatch(receiveError(err.toString()))
        callback && callback(err.toString())
      })
  }
}

export function setProducer(producer) {
  return {
    type: t.SET_PRODUCER,
    producer,
    receivedAt: Date.now(),
    meta: {
      loading: false
    }
  }
}

export function getProducer(producerRequest, callback) {
  return (dispatch, getState) => {
    dispatch(requestData('getProducer'))
    return request(config.bffServiceBase + '/sales/user/getProducer', producerRequest)
      .then(data => {
        let producer = Object.assign({}, data.producer)
        producer.tenantCode = producerRequest.tenantCode
        sessionStorage.setItem('SALES_APP_PRODUCER', JSON.stringify(producer))
        dispatch(setProducer(producer))
        callback && callback(null, producer)
      })
      .catch((err) => {
        console.log('server error', err)
        dispatch(receiveError(err.toString()))
        callback && callback(err.toString())
      })
  }
}
