import {combineReducers} from 'redux'
import * as t from './actionTypes'

const initUiState = {
  productModel: null,
}

function ui(state = initUiState, action) {
  switch (action.type) {
    case t.SET_PRODUCT_MODEL:
      return Object.assign({}, state, {
        productModel: action.productModel,
      })
    default:
      return state
  }
}

const initDataState = {
  productData: null,
  producer: null,
}

function data(state = initDataState, action) {
  switch (action.type) {
    case t.RECEIVE_PRODUCT_DATA:
      return Object.assign({}, state, {
        productData: action.productData,
      })
    case t.SET_PRODUCER:
      return Object.assign({}, state, {producer: action.producer})
    default:
      return state
  }
}

const reducer = combineReducers({
  ui,
  data,
})

export default reducer
