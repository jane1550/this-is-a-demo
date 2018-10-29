import * as t from './actionTypes'
import request from '../../../common/request'
import {requestData, receiveError} from '../../../common/actions'
import config from '../../../config'

//private actions start
function setHomeData (homeData) {
  return {
    type: t.RECEIVE_HOME_DATA,
    homeData,
    meta: {
      loading: false
    }
  }
}

//export actions start
export function setHomeModel (homeModel) {
  return {
    type: t.SET_HOME_MODEL,
    homeModel,
    meta: {
      loading: false
    }
  }
}

//export async actions start
export function getHomeData (homeRequest, callback) {
  return (dispatch, getState) => {
    dispatch(requestData('getHomeData'))
    return request('/rest/home', homeRequest)
      .then(data => {
        dispatch(setHomeData(data))
        callback && callback(null, data)
      })
      .catch((err) => {
        console.log('server error', err)
        dispatch(receiveError(err.toString()))
        callback && callback(err.toString())
      })
  }
}
