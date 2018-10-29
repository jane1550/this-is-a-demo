import * as t from './actionTypes'
import request from '../../../common/request'
import {requestData, receiveError} from '../../../common/actions'
import config from '../../../config'

// private actions start
function setRidersList(ridersList) {
  return {
    type: t.RECEIVE_RIDERS_LIST,
    ridersList,
    receivedAt: Date.now(),
    meta: {
      loading: false
    }
  }
}

function receivePlanIllustration(illusMap) {
  return {
    type: t.RECEIVE_PLAN_ILLUSTRATION,
    illusMap,
    receivedAt: Date.now(),
    meta: {
      loading: false
    }
  }
}

// export actions start
export function resetPage() {
  return {
    type: t.RESET_PAGE,
    meta: {
      loading: false
    }
  }
}

export function setPlan(plan) {
  return {
    type: t.SET_PLAN,
    plan,
    meta: {
      loading: false
    }
  }
}

export function setProposal(proposal) {
  return {
    type: t.SET_PROPOSAL,
    proposal,
    meta: {
      loading: false
    }
  }
}

export function setPlanInitialData(data) {
  return {
    type: t.RECEIVE_PLAN_INITIAL_DATA,
    data,
    receivedAt: Date.now(),
    meta: {
      loading: false
    }
  }
}

export function setCalcPremiumData(calcPremiumData) {
  return {
    type: t.RECEIVE_CALC_PREMIUM,
    calcPremiumData,
    receivedAt: Date.now(),
    meta: {
      loading: false
    }
  }
}

export function setSavePlan(savePlan) {
  return {
    type: t.RECEIVE_SAVE_PLAN,
    savePlan,
    receivedAt: Date.now(),
    meta: {
      loading: false
    }
  }
}

export function setCustomer(customer) {
  return {
    type: t.SET_CUSTOMER,
    customer,
    receivedAt: Date.now(),
    meta: {
      loading: false
    }
  }
}

export function setSaveProposal(saveProposal) {
  return {
    type: t.RECEIVE_SAVE_PROPOSAL,
    saveProposal,
    receivedAt: Date.now(),
    meta: {
      loading: false
    }
  }
}

export function setCustomers(customers) {
  return {
    type: t.RECEIVE_CUSTOMERS,
    customers,
    receivedAt: Date.now(),
    meta: {
      loading: false
    }
  }
}

// export async actions start
export function getPlanInitialData(params, callback) {
  return (dispatch, getState) => {
    dispatch(requestData('getPlanInitialData'))
    return request(config.bffServiceBase + '/sales/product/getRuleMetaData', params)
      .then(data => {
        dispatch(setPlanInitialData(data))
        callback && callback(null, data)
      })
      .catch((err) => {
        console.log('server error', err)
        dispatch(receiveError(err.toString()))
        callback && callback(err.toString())
      })
  }
}

export function getRiders(ridersSearchParam, callback) {
  return (dispatch, getState) => {
    dispatch(requestData('getRiders'))
    return request(config.bffServiceBase + '/sales/product/findAvailableRiders', ridersSearchParam)
      .then(data => {
        let {salesProductConfigInfoList} = data
        dispatch(setRidersList(salesProductConfigInfoList || []))
        callback && callback(null)
      })
      .catch((err) => {
        console.log('server error', err)
        dispatch(receiveError(err.toString()))
        callback && callback(err.toString())
      })
  }
}

export function calcPremium(plan, callback) {
  return (dispatch, getState) => {
    dispatch(requestData('calcPremium'))
    return request(config.bffServiceBase + '/proposal/quote', plan)
      .then(data => {
        dispatch(setCalcPremiumData(data))
        callback && callback(null, data.totalFirstYearPrem, data.annualPrem, data.coveragePrems)
      })
      .catch((err) => {
        console.log('server error', err)
        dispatch(receiveError(err.toString()))
        callback && callback(err.toString())
      })
  }
}

export function getCustomers(params, callback) {
  return (dispatch, getState) => {
    dispatch(requestData('getCustomers'))
    return request(config.bffServiceBase + '/sales/prospect/find', params)
      .then(data => {
        dispatch(setCustomers(data.prospectList))
        callback && callback(null)
      })
      .catch((err) => {
        console.log('server error', err)
        dispatch(receiveError(err.toString()))
        callback && callback(err.toString())
      })
  }
}

export function savePlan(planRequest, callback) {
  return (dispatch, getState) => {
    dispatch(requestData('savePlan'))
    return request(config.bffServiceBase +
      `/plan/save?msg=${encodeURIComponent(sessionStorage.getItem("SALES_APP_MSG"))}&sign=${encodeURIComponent(sessionStorage.getItem("SALES_APP_SIGN"))}`,
      planRequest)
      .then(data => {
        data.order.order.quotationCode = data.order.code
        dispatch(setSavePlan(data.order))
        callback && callback(null, data.order)
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
        let {illusMap} = data
        dispatch(receivePlanIllustration(illusMap))
        callback && callback(null, illusMap)
      })
      .catch((err) => {
        console.log('server error', err)
        dispatch(receiveError(err.toString()))
        callback && callback(err.toString())
      })
  }
}

export function saveProposal(proposalReqeust, callback) {
  return (dispatch, getState) => {
    dispatch(requestData('saveProposal'))
    return request(config.bffServiceBase +
      `/proposal/save?msg=${encodeURIComponent(sessionStorage.getItem("SALES_APP_MSG"))}&sign=${encodeURIComponent(sessionStorage.getItem("SALES_APP_SIGN"))}`,
      proposalReqeust)
      .then(data => {
        data.order.order.proposalCode = data.order.code
        dispatch(setSaveProposal(data.order))
        callback && callback(null, data.order)
      })
      .catch((err) => {
        console.log('server error', err)
        dispatch(receiveError(err.toString()))
        callback && callback(err.toString())
      })
  }
}

export function underwriteProposal(proposalReqeust, callback) {
  return (dispatch, getState) => {
    dispatch(requestData('underwriteProposal'))
    return request(config.bffServiceBase + '/ebaocloud-li/proposal/underwrite', proposalReqeust)
      .then(data => {
        dispatch(setProposal(data.proposal))
        callback && callback(null, data.proposal)
      })
      .catch((err) => {
        console.log('server error', err)
        dispatch(receiveError(err.toString()))
        callback && callback(err.toString())
      })
  }
}

export function acceptProposal(proposalReqeust, callback) {
  return (dispatch, getState) => {
    dispatch(requestData('acceptProposal'))
    return request(config.bffServiceBase + '/proposal/accept', proposalReqeust)
      .then(data => {
        dispatch(setProposal(data.proposal))
        callback && callback(null, data.proposal)
      })
      .catch((err) => {
        console.log('server error', err)
        dispatch(receiveError(err.toString()))
        callback && callback(err.toString())
      })
  }
}

export function issueProposal(proposalReqeust, callback) {
  return (dispatch, getState) => {
    dispatch(requestData('issueProposal'))
    return request(config.bffServiceBase + '/proposal/issue', proposalReqeust)
      .then(data => {
        dispatch(setProposal(data.proposal))
        callback && callback(null, data.proposal)
      })
      .catch((err) => {
        console.log('server error', err)
        dispatch(receiveError(err.toString()))
        callback && callback(err.toString())
      })
  }
}

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

export function getProposal(proposalCode, callback) {
  return (dispatch, getState) => {
    dispatch(requestData('getProposal'))
    return request(config.bffServiceBase +
      `/proposal/${proposalCode}?msg=${encodeURIComponent(sessionStorage.getItem("SALES_APP_MSG"))}&sign=${encodeURIComponent(sessionStorage.getItem("SALES_APP_SIGN"))}`)
      .then(data => {
        data.order.order.proposalCode = data.order.code
        dispatch(setProposal(data.order.order))
        callback && callback(null, data.order.order)
      })
      .catch((err) => {
        console.log('server error', err)
        dispatch(receiveError(err.toString()))
        callback && callback(err.toString())
      })
  }
}

//
// ─── PRODUCER ACTIONS ────────────────────────────────────────────────────────────
//
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

export function verifyMobile(mobileRequest, callback) {
  return (dispatch, getState) => {
    dispatch(requestData('sendSms'))
    return request(config.bffServiceBase + '/user/checkCode', mobileRequest)
      .then(data => {
        let customer = {
          mobile: mobileRequest.mobile,
          vcdoe: mobileRequest.verificationCode,
          verified: true,
        }
        dispatch(setCustomer(customer))
        callback && callback(null, customer)
      })
      .catch((err) => {
        console.log('server error', err)
        dispatch(receiveError(err.toString()))
        callback && callback(err.toString())
      })
  }
}

// SMS
function setSendSms(sendSmsData) {
  return {
    type: t.RECEIVE_SEND_SMS_DATA,
    sendSmsData,
    meta: {
      loading: false
    }
  }
}

export function sendSms(mobile, callback) {
  return (dispatch, getState) => {
    dispatch(requestData('sendSms'))
    return request(config.bffServiceBase + '/user/sendCode?mobile=' + encodeURIComponent(mobile), {})
      .then(data => {
        dispatch(setSendSms(data))
        callback && callback(null, data)
      })
      .catch((err) => {
        console.log('server error', err)
        dispatch(receiveError(err.toString()))
        callback && callback(err.toString())
      })
  }
}
