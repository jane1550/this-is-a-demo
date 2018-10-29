import React from 'react'
import PropTypes from 'prop-types'
import './ProductListView.scss'
import browserHistory from '../../../common/history'
import BaseComponent from '../../../components/BaseComponent'
import ProductCard from './ProductCard'
import SearchBar from '../../../components/SearchBar'

export default class ProductListView extends BaseComponent {
  constructor(props) {
    super(props)
  }

  toProduct(productCode) {
    browserHistory.push(`/product/${productCode}`)
  }

  renderHeader() {
    return (
      <div className="bg-grey">
        <SearchBar/>
      </div>
    )
  }

  renderContent() {
    let products = [
      {
        "packageCode": "EBAOCI",
        "packageName": "Critical Illness",
        "minAge": 28,
        "minAgeUnit": "5",
        "maxAge": 70,
        "maxAgeUnit": "1",
        "coveragePeriods": [
          {
            "periodType": 1,
            "periodValue": 0
          },
          {
            "periodType": 3,
            "periodValue": 70
          }
        ],
        "insurer": {
          "insurerCode": "eBao",
          "abbrName": "eBao",
        },
      },
      {
        "packageCode": "PMA",
        "packageName": "Accident",
        "minAge": 18,
        "minAgeUnit": "1",
        "maxAge": 60,
        "maxAgeUnit": "1",
        "coveragePeriods": [
          {
            "periodType": "5",
            "periodValue": 15
          },
          {
            "periodType": "5",
            "periodValue": 30
          },
          {
            "periodType": "5",
            "periodValue": 90
          },
          {
            "periodType": "5",
            "periodValue": 180
          },
          {
            "periodType": "5",
            "periodValue": 360
          }
        ],
        "insurer": {
          "insurerCode": "eBao",
          "abbrName": "eBao",
        },
      }
    ]
    return (
      <div className="h-100 p-3 bg-light">
        <div className="row mb-3">
          {products.map((product, index) =>
            <ProductCard key={index} salesPackage={product} onClick={() => this.toProduct(product.packageCode)}/>
          )}
        </div>
      </div>
    )
  }

  checkUser() {
    let userString = sessionStorage.getItem("SALES_APP_PRODUCER")
    let loginInApp = sessionStorage.getItem("SALES_APP_FROM_LOGIN")
    if (userString && loginInApp === "true") {
      browserHistory.replace('/me')
    } else {
      this.confirm(null, 'Please login to continue', () => {
        sessionStorage.setItem("SALES_APP_REDIRECT_URL", '/me')
        browserHistory.push('/login')
      })
    }
  }

  renderFooter() {
    return (
      <nav className="nav nav-pills nav-justified bg-grey">
        <a className="nav-item nav-link active border-right p-2 d-flex flex-column" tabIndex={91}>
          <h4 className="mb-0"><i className="fas fa-home"/></h4>
          <small>Home</small>
        </a>
        <a className="nav-item nav-link border-right p-2 d-flex flex-column" tabIndex={92}
           onClick={this.checkUser.bind(this)}>
          <h4 className="mb-0"><i className="fas fa-user-circle"/></h4>
          <small>Me</small>
        </a>
      </nav>
    )
  }
}
