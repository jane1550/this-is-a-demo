import React from 'react'
import PropTypes from 'prop-types'
import './OrdersView.scss'
import browserHistory from '../../../common/history'
import BaseComponent from '../../../components/BaseComponent'
import Header from '../../../components/Header'
import SearchBar from '../../../components/SearchBar'
import {NavTab} from '../../../components/Navs'
import {
  formatNumber,
  formatDate,
} from '../../../common/utils'


export const proposalStatus = {
  "31": 'Waiting for Underwriting', // generated or none underwriting
  "79": 'Underwriting Pass', // underwriting passed
  "82": 'Underwriting Failed', // underwriting failed, can retry underwriting
  "80": 'Accepted', // accept or waiting for payment
  "87": 'Payment Failed', // payment failed, can retry issue
  "85": 'Issued', // issued
  "88": 'Invalid', // deleted or invalid
  "89": 'Waiting for Payment Result', // waiting for payment response, usually for online payment callback
  "90": 'Payed', // payed but not issued, usually error happens on online payment callback, can retry issue
  "91": 'Issue Failed' // issued failed, can retry issue
}
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
    this.fetchProposalList()
  }

  fetchProposalList() {
    this.props.actions.fetchProposalList((err, data) => {
      if (err) {
        this.alert(err, 'Error')
      } else {

      }
    })
  }

  buildProposal(proposal, showAction) {
    return (
      <div className="card mt-3 mb-3 ml-1 mr-1 shadow-sm" key={proposal.code}>
        <div className="card-body">
          <div className="card-title mb-0">
            <h5><strong>{proposal.order.packageName}</strong></h5>
          </div>
          <div className="card-text pl-1 row">
            <div className='col-12'>
              <h6><strong>Proposalholder: {proposal.order.proposer.name}</strong></h6>
            </div>
            <div className="col-12 col-md-6">
              Proposal No.: {proposal.code}
            </div>
            <div className="col-12 col-md-6">
              Submit Date: {formatDate(proposal.order.submitDate)}
            </div>
            <div className="col-12 col-md-6">
              Main Insured: {proposal.order.insureds[0].name}
            </div>
            <div className="col-12 col-md-6">
              Premium
              ({PAYMENT_TYPE[proposal.order.mainCoverages[0].paymentFreq.toString()]}): {formatNumber(proposal.order.totalFirstYearPrem)}
            </div>
            <div className="col-12 col-md-6">
              <span>Proposal Status: </span>
              <span className={proposal.order.proposalStatus === "85" ? "text-success" : "text-warning"}>
                    {proposalStatus[proposal.order.proposalStatus]}</span>
            </div>
            {proposal.order.proposalStatus === "85" &&
            <div className="col-12 col-md-6">
              Policy No.: {proposal.order.policyCode || proposal.order.applyCode}
            </div>
            }
            {showAction && proposal.order.proposalStatus !== "85" &&
            <div className="col-12 mt-2 text-right">
              <a className="btn btn-primary" tabIndex={1}
                 onClick={() => this.gotoProposal(proposal.order.packageCode, proposal.order.quotationCode, proposal.code)}>Continue</a>
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
        <Header title="My Orders"/>
        <div className="bg-grey">
          <SearchBar placeholder="Product Name / Customer Name / Submit Date" value={this.state.searchWord}
                     onChange={searchWord => this.setState({searchWord})} onSearch={() => this.fetchProposalList()}/>
        </div>
      </React.Fragment>
    )
  }

  gotoProposal(packageCode, quotationCode, proposalCode) {
    this.props.proposalActions.resetPage()
    browserHistory.push(`/proposal/${packageCode}/proposal/${quotationCode || '0'}/${proposalCode}`)
  }

  renderContent() {
    let userString = sessionStorage.getItem('SALES_APP_PRODUCER')
    const producer = JSON.parse(userString)
    const type = producer.producerType
    const {proposalListData} = this.props
    if (!proposalListData) {
      return (
        <div className="text-center p-3 text-muted">
          <h5>No proposal Found!</h5>
        </div>
      )
    }
    const {agentOrders, holderOrders} = proposalListData
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
      let proposalList_agentOrders = agentOrders
      if (searchWord) {
        proposalList_agentOrders = proposalList_agentOrders.filter(proposal => this.searchFilter(proposal, searchWord))
      }
      if (proposalList_agentOrders.length === 0 || !proposalList_agentOrders) {
        tabContents.push(
          <div className="text-center p-3 text-muted">
            <h5>No proposal Found!</h5>
          </div>
        )
      }
      else {
        tabContents.push(
          <div>
            {proposalList_agentOrders.map(proposal => this.buildProposal(proposal, true))}
          </div>
        )
      }
      let proposalList_holderOrders = holderOrders
      if (searchWord) {
        proposalList_holderOrders = proposalList_holderOrders.filter(proposal => searchFilter(proposal, searchWord))
      }
      if (proposalList_holderOrders.length === 0 || !proposalList_holderOrders) {
        tabContents.push(
          <div className="text-center p-3 text-muted">
            <h5>No proposal Found!</h5>
          </div>
        )
      }
      else {
        tabContents.push(
          <div>
            {proposalList_holderOrders.map(proposal => this.buildProposal(proposal, true))}
          </div>
        )
      }
    } else {
      let proposalList_holderOrders = holderOrders
      if (searchWord) {
        proposalList_holderOrders = proposalList_holderOrders.filter(proposal => searchFilter(proposal, searchWord))
      }
      if (proposalList_holderOrders.length === 0 || !proposalList_holderOrders) {
        tabContents.push(
          <div className="text-center p-3 text-muted">
            <h5>No proposal Found!</h5>
          </div>
        )
      }
      else {
        tabContents.push(
          <div>
            {proposalList_holderOrders.map(proposal => this.buildProposal(proposal, true))}
          </div>
        )
      }
      let proposalList_agentOrders = agentOrders
      if (searchWord) {
        proposalList_agentOrders = proposalList_agentOrders.filter(proposal => this.searchFilter(proposal, searchWord))
      }
      if (proposalList_agentOrders.length === 0 || !proposalList_agentOrders) {
        tabContents.push(
          <div className="text-center p-3 text-muted">
            <h5>No proposal Found!</h5>
          </div>
        )
      }
      else {
        tabContents.push(
          <div>
            {proposalList_agentOrders.map(proposal => this.buildProposal(proposal, false))}
          </div>
        )
      }
    }


    return (
      <NavTab tabTitles={tabList} tabContents={tabContents}/>
    )
  }
}
