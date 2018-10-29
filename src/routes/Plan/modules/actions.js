import * as t from './actionTypes'
import request from '../../../common/request'
import {requestData, receiveError} from '../../../common/actions'
import config from '../../../config'

function setPlan(plan) {
  return {
    type: t.RECEIVE_PLAN,
    plan,
    meta: {
      loading: false
    }
  }
}

function receivePackageDetail(salesPackageInfo) {
  return {
    type: t.RECEIVE_PACKAGE_DETAIL,
    salesPackageInfo,
    receivedAt: Date.now(),
    meta: {
      loading: false
    }
  }
}

function receiveProductsLiabs(liabilitiesMap, funds) {
  return {
    type: t.RECEIVE_PRODUCTS_LIABS,
    liabilitiesMap,
    funds,
    receivedAt: Date.now(),
    meta: {
      loading: false
    }
  }
}

function receivePlanIllustration (illusMap) {
  return {
    type: t.RECEIVE_PLAN_ILLUSTRATION,
    illusMap,
    receivedAt: Date.now(),
    meta: {
      loading: false
    }
  }
}

function receiveDocId (docId, docName) {
  return {
    type: t.RECEIVE_DOC_ID,
    docId,
    docName,
    receivedAt: Date.now(),
    meta: {
      loading: false
    }
  }
}


//export async actions start
export function getPlan(quotationCode, callback) {
  return (dispatch, getState) => {
    dispatch(requestData('getPlan'))
    return request(config.bffServiceBase +
      `/plan/${quotationCode}`)
      .then(data => {
        data.order.order.quotationCode = data.order.code
        dispatch(setPlan(data.order.order))
        callback && callback(null, data.order.order)
      })
      .catch((err) => {
        console.log('server error', err)
        dispatch(receiveError(err.toString()))
        callback && callback(err.toString())
      })
  }
}

export function fetchPackageDetail(searchCondition, callback) {
  return (dispatch, getState) => {
    dispatch(requestData('fetchPackageDetail'))
    return request(config.bffServiceBase + '/sales/package/getDetail', searchCondition)
      .then(data => {
        let {salesPackageInfo} = data
        dispatch(receivePackageDetail(salesPackageInfo))
        callback && callback(null, salesPackageInfo)
      })
      .catch((err) => {
        console.log('server error', err)
        dispatch(receiveError(err.toString()))
        callback && callback(err.toString())
      })
  }
}

export function fetchProductsLiabs(searchCondition, callback) {
  return (dispatch, getState) => {
    dispatch(requestData('fetchProductsLiabs'))
    return request(config.bffServiceBase + '/sales/product/getBasic', searchCondition)
      .then(data => {
        let {liabilitiesMap, funds} = data
        dispatch(receiveProductsLiabs(liabilitiesMap, funds))
        callback && callback(null, liabilitiesMap, funds)
      })
      .catch((err) => {
        console.log('server error', err)
        dispatch(receiveError(err.toString()))
        callback && callback(err.toString())
      })
  }
}

export function fetchPlanIllustration(searchCondition, callback) {
  return (dispatch, getState) => {
    dispatch(requestData('fetchPlanIllustration'))
    return request(config.bffServiceBase + '/sales/product/illustrationCalc', searchCondition)
      .then(data => {
        let orgIllusMap = getState().plan.data.illusMap
        let {illusMap} = data
        if (searchCondition.performanceLevel) {
          orgIllusMap[searchCondition.performanceLevel.toString()] = illusMap[searchCondition.performanceLevel.toString()]
        } else {
          orgIllusMap = illusMap
        }
        dispatch(receivePlanIllustration(orgIllusMap))
        callback && callback(null, orgIllusMap)
      })
      .catch((err) => {
        console.log('server error', err)
        dispatch(receiveError(err.toString()))
        callback && callback(err.toString())
      })
  }
}

export function creatPdf(requestBody, callback) {
  return (dispatch, getState) => {
    dispatch(requestData('fetchPlanIllustration'))
    return request(config.bffServiceBase + '/docs/create', requestBody)
      .then(data => {
        dispatch(receiveDocId(data.docId, data.docName))
        callback && callback(null, data.docId, data.docName)
      })
      .catch((err) => {
        console.log('server error', err)
        dispatch(receiveError(err.toString()))
        callback && callback(err.toString())
      })
  }
}
