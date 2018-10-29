import React from 'react'
import PropTypes from 'prop-types'
import './PoliciesView.scss'
import browserHistory from '../../../common/history'
import BaseComponent from '../../../components/BaseComponent'
import Header from '../../../components/Header'
import SearchBar from '../../../components/SearchBar'
import {NavTab} from '../../../components/Navs'

import {
  formatNumber,
  formatDate,
} from '../../../common/utils'
import {proposalStatus} from "../../Orders/components/OrdersView";

const PAYMENT_TYPE = {
  '1': 'Yearly',
  '2': 'Half-Yearly',
  '3': 'Quarterly',
  '4': 'Monthly',
  '5': 'Single',
}

function searchFilter(policy, searchWord) {
  return policy.code.toLowerCase().includes(searchWord.toLowerCase())
    || policy.order.packageName.toLowerCase().includes(searchWord.toLowerCase())
    || policy.order.proposer.name.toLowerCase().includes(searchWord.toLowerCase())
    || policy.order.insureds[0].name.toLowerCase().includes(searchWord.toLowerCase())
    || formatDate(policy.order.inforceDate).includes(searchWord)
}

export default class PoliciesView extends BaseComponent {
  constructor(props) {
    super(props)
    this.state = {
      tabs: [
        {tabName: "Hold", id: 1},
        {tabName: "Recommended", id: 2},
      ],
      currentIndex: 1,
    };
  }

  componentDidMount() {
    this.fetchPolicyList()
  }

  tabChoiced = (id) => {
    this.setState({
      currentIndex: id
    });
  }


  fetchPolicyList() {
    this.props.actions.fetchPolicyList((err, data) => {
      if (err) {
        this.alert(err, 'Error')
      } else {

      }
    })
  }

  gotoPolicy(insurerCode, policyCode) {
    browserHistory.push(`/policy/${insurerCode}/${policyCode}`)
  }

  buildPolicy(policy, showAction) {
    return (
      <div className="card mt-3 mb-3 ml-1 mr-1 shadow-sm" key={policy.code}>
        <div className="card-body" key={policy.code}>
          <div className="card-title mb-0">
            <h5><strong>{policy.order.packageName}</strong></h5>
          </div>
          <div className="card-text pl-1 row">
            <div className='col-12'>
              <h6><strong>Policyholder: {policy.order.proposer.name}</strong></h6>
            </div>
            <div className="col-12 col-md-6">
              Policy No.: {policy.code}
            </div>
            <div className="col-12 col-md-6">
              Inforce Date: {formatDate(policy.order.inforceDate)}
            </div>
            <div className="col-12 col-md-6">
              Main Insured: {policy.order.insureds[0].name}
            </div>
            <div className="col-12 col-md-6">
              Premium
              ({PAYMENT_TYPE[policy.order.mainCoverages[0].paymentFreq.toString()]}): {formatNumber(policy.order.totalFirstYearPrem)}
            </div>
            {showAction &&
            <div className="col-12 mt-2 text-right">
              <a className="btn btn-primary" tabIndex={1}
                 onClick={() => this.gotoPolicy(policy.order.salesCompanyCode, policy.code)}>View</a>
            </div>
            }
          </div>
        </div>
      </div>
    )
  }

  renderHeader() {
    return (
      <React.Fragment>
        <Header title="My Policies"/>
        <div className="bg-grey">
          <SearchBar placeholder="Policy No. / Product Name / Customer Name / Inforce Date"
                     value={this.state.searchWord}
                     onChange={searchWord => this.setState({searchWord})} onSearch={() => this.fetchPolicyList()}/>
        </div>
      </React.Fragment>
    )
  }


  renderContent() {
    let userString = sessionStorage.getItem('SALES_APP_PRODUCER')
    const producer = JSON.parse(userString)
    const type = producer.producerType
    const {policyListData} = this.props
    if (!policyListData) {
      return (
        <div className="text-center p-3 text-muted">
          <h5>No policy Found!</h5>
        </div>
      )
    }
    const {agentOrders, holderOrders} = policyListData
    const {searchWord} = this.state
    let tabList = []
    if (type === "1") {
      tabList.push('Sales')
      tabList.push('Hold')
    } else {
      tabList.push('Hold')
      tabList.push('Introduced')
    }

    let tabContents = []
    if (type === "1") {
      let policyList_agentOrders = agentOrders
      if (searchWord) {
        policyList_agentOrders = policyList_agentOrders.filter(policy => this.searchFilter(policy, searchWord))
      }
      if (policyList_agentOrders.length === 0 || !policyList_agentOrders) {
        tabContents.push(
          <div className="text-center p-3 text-muted">
            <h5>No policy Found!</h5>
          </div>
        )
      }
      else {
        tabContents.push(
          <div>
            {policyList_agentOrders.map(policy => this.buildPolicy(policy, true))}
          </div>
        )
      }
      let policyList_holderOrders = holderOrders
      if (searchWord) {
        policyList_holderOrders = policyList_holderOrders.filter(policy => searchFilter(policy, searchWord))
      }
      if (policyList_holderOrders.length === 0 || !policyList_holderOrders) {
        tabContents.push(
          <div className="text-center p-3 text-muted">
            <h5>No policy Found!</h5>
          </div>
        )
      }
      else {
        tabContents.push(
          <div>
            {policyList_holderOrders.map(policy => this.buildPolicy(policy, true))}
          </div>
        )
      }
    } else {
      let policyList_holderOrders = holderOrders
      if (searchWord) {
        policyList_holderOrders = policyList_holderOrders.filter(policy => searchFilter(policy, searchWord))
      }
      if (policyList_holderOrders.length === 0 || !policyList_holderOrders) {
        tabContents.push(
          <div className="text-center p-3 text-muted">
            <h5>No policy Found!</h5>
          </div>
        )
      }
      else {
        tabContents.push(
          <div>
            {policyList_holderOrders.map(policy => this.buildPolicy(policy, true))}
          </div>
        )
      }
      let policyList_agentOrders = agentOrders
      if (searchWord) {
        policyList_agentOrders = policyList_agentOrders.filter(policy => this.searchFilter(policy, searchWord))
      }
      if (policyList_agentOrders.length === 0 || !policyList_agentOrders) {
        tabContents.push(
          <div className="text-center p-3 text-muted">
            <h5>No policy Found!</h5>
          </div>
        )
      }
      else {
        tabContents.push(
          <div>
            {policyList_agentOrders.map(policy => this.buildPolicy(policy, false))}
          </div>
        )
      }
    }


    return (
      <NavTab tabTitles={tabList} tabContents={tabContents}/>
    )
  }
}


