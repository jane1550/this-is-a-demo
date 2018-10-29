import React from 'react'
import PropTypes from 'prop-types'
import './QuotationsView.scss'
import browserHistory from '../../../common/history'

import BaseComponent from '../../../components/BaseComponent'
import Header from '../../../components/Header'
import SearchBar from '../../../components/SearchBar'
import {
  formatNumber,
  formatDate,
} from '../../../common/utils'

const PAYMENT_TYPE = {
  '1': 'Yearly',
  '2': 'Half-Yearly',
  '3': 'Quarterly',
  '4': 'Monthly',
  '5': 'Single',
}

export default class OrdersView extends BaseComponent {
  constructor(props) {
    super(props)
    this.state = {
      searchWord: '',
      filterFunc: null,
    }
  }

  componentDidMount() {
    this.fetchQuotationList()
  }

  fetchQuotationList() {
    this.props.actions.fetchQuotationList((err, data) => {
      if (err) {
        this.alert(err, 'Error')
      } else {

      }
    })
  }

  renderHeader() {
    return (
      <React.Fragment>
        <Header title="My Quotations"/>
        <div className="bg-grey">
          <SearchBar placeholder="Product Name / Birth Date / Submit Date" value={this.state.searchWord}
                     onChange={searchWord => this.setState({searchWord})} onSearch={() => this.fetchQuotationList()}/>
        </div>
      </React.Fragment>
    )
  }

  gotoPlan(quotationCode) {
    this.props.proposalActions.resetPage()
    browserHistory.push(`/plan/${quotationCode}`)
  }

  renderContent() {
    const {quotationListData} = this.props
    if (!quotationListData) {
      return (
        <div className="text-center p-3 text-muted">
          <h5>No Quotation Found!</h5>
        </div>
      )
    }
    const {agentOrders, holderOrders} = quotationListData
    const {searchWord} = this.state
    let quotationList = [...holderOrders, ...agentOrders]
    if (searchWord) {
      quotationList = quotationList.filter((quotation) =>
        quotation.order.packageName.toLowerCase().includes(searchWord.toLowerCase())
        || quotation.order.proposer.birthday.includes(searchWord)
        || quotation.order.insureds[0].birthday.includes(searchWord)
        || formatDate(quotation.order.submitDate).includes(searchWord)
      )
    }
    if (quotationList.length === 0) {
      return (
        <div className="text-center p-3 text-muted">
          <h5>No quotation Found!</h5>
        </div>
      )
    }
    return (
      <div style={{height: '100%'}}>
        {quotationList.map(quotation =>
          <div className="card m-3 shadow-sm" key={quotation.code}>
            <div className="card-body" key={quotation.code}>
              <div className="card-title mb-0">
                <h5><strong>{quotation.order.packageName}</strong></h5>
              </div>
              <div className="card-text pl-1 row">
                <div className="col-12 col-md-6">
                  Quotation No.: {quotation.code}
                </div>
                <div className="col-12 col-md-6">
                  Submit Date: {formatDate(quotation.order.submitDate)}
                </div>
                <div className="col-12 col-md-6">
                  Insured Birth
                  Date: {formatDate(quotation.order.insureds[0].birthday)} (Age {quotation.order.insureds[0].age})
                </div>
                <div className="col-12 col-md-6">
                  Premium
                  ({PAYMENT_TYPE[quotation.order.mainCoverages[0].paymentFreq.toString()]}): {formatNumber(quotation.order.totalFirstYearPrem)}
                </div>
                <div className="col-12 mt-2 text-right">
                  <a className="btn btn-primary" tabIndex={1}
                     onClick={() => this.gotoPlan(quotation.code)}>View</a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

    )
  }
}




