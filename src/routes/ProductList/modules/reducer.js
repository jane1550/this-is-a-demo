import {combineReducers} from 'redux'
import * as t from './actionTypes'

const initUiState = {
  productListModel: null,
  productModel: null,
}

function ui(state = initUiState, action) {
  switch (action.type) {
    case t.SET_PRODUCTLIST_MODEL:
      return Object.assign({}, state, {
        productListModel: action.productListModel,
      })
    default:
      return state
  }
}

const initDataState = {
  productListData: null,
  productData: null,
}

function data(state = initDataState, action) {
  switch (action.type) {
    case t.RECEIVE_PRODUCTLIST_DATA:
      return Object.assign({}, state, {
        productListData: action.productListData,
      })
    default:
      return state
  }
}

const reducer = combineReducers({
  ui,
  data,
})

export default reducer
