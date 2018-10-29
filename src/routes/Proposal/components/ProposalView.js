import React from 'react'
import PropTypes from 'prop-types'
import './ProposalView.scss'
import browserHistory from '../../../common/history'
import BaseComponent from "../../../components/BaseComponent"
import QuoteView from './QuoteView'
import OrganProposerInfoView from './OrganProposerInfoView'
import ProposerInfoView from './ProposerInfoView'
import InsuredInfoView from './InsuredInfoView'
import PaymentInfoView from './PaymentInfoView'
import CheckOrderView from './CheckOrderView'
import ResultView from './ResultView'
import Header from "../../../components/Header";

export default class ProposalView extends BaseComponent {
  constructor(props) {
    super(props)
    this.state = {
      producerLoaded: false,
    }
  }

  componentDidMount() {
    this.loadProducer()
  }

  loadProducer(callback) {
   let tenantCode = this.props.location.query.tenantCode
    if (!tenantCode && !sessionStorage.getItem('SALES_APP_TENANT_CODE')) {
      tenantCode = 'eBao'
      sessionStorage.setItem('SALES_APP_TENANT_CODE', tenantCode)
    } else if (
      tenantCode &&
      tenantCode !== sessionStorage.getItem('SALES_APP_TENANT_CODE')
    ) {
      // tenantCode changes clear old session
      sessionStorage.removeItem('SALES_APP_PRODUCER')
      sessionStorage.removeItem('SALES_APP_MSG')
      sessionStorage.removeItem('SALES_APP_SIGN')
      sessionStorage.setItem('SALES_APP_TENANT_CODE', tenantCode)
    } else {
      tenantCode = sessionStorage.getItem('SALES_APP_TENANT_CODE')
    }
    let msg = this.props.location.query.msg
    if (msg) {
      msg = msg.replace(/ /g, '+')
    }
    let sign = this.props.location.query.sign
    if ((msg && !sign) || (!msg && sign)) {
      this.alert('Invalid query parameters in url', 'Error')
      this.setState({producerLoaded: false})
      return
    }
    if (
      !msg && !sign && !sessionStorage.getItem('SALES_APP_MSG') && !sessionStorage.getItem('SALES_APP_SIGN')
    ) {
      callback && callback(null)
      this.setState({producerLoaded: true})
      return
    } else if (
      (msg && msg !== sessionStorage.getItem('SALES_APP_MSG')) ||
      (sign && sign !== sessionStorage.getItem('SALES_APP_SIGN'))
    ) {
      // msg or sign changes clear old session
      sessionStorage.removeItem('SALES_APP_PRODUCER')
      sessionStorage.removeItem('SALES_APP_MSG')
      sessionStorage.removeItem('SALES_APP_SIGN')
      sessionStorage.setItem('SALES_APP_MSG', msg)
      sessionStorage.setItem('SALES_APP_SIGN', sign)
    } else {
      msg = sessionStorage.getItem('SALES_APP_MSG')
      sign = sessionStorage.getItem('SALES_APP_SIGN')
    }
    if (!msg || !sign) {
      callback && callback(null)
      this.setState({producerLoaded: true})
      return
    }
    let producerInSession = sessionStorage.getItem('SALES_APP_PRODUCER')
    if (producerInSession) {
      let producer = JSON.parse(producerInSession)
      this.props.actions.setProducer(producer)
      callback && callback(producer)
      this.setState({producerLoaded: true})
      return
    }
    let producerRequest = {
      msg: sessionStorage.getItem('SALES_APP_MSG'),
      sign: sessionStorage.getItem('SALES_APP_SIGN'),
      tenantCode: sessionStorage.getItem('SALES_APP_TENANT_CODE'),
    }
    this.props.actions.getProducer(producerRequest, (error, producer) => {
      if (error) {
        this.alert('Failed to fetch user', 'Error')
        this.setState({producerLoaded: false})
        return
      }
      callback && callback(producer)
      this.setState({producerLoaded: true})
    })
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.params.proposalStep !== nextProps.params.proposalStep) {
      this.scrollTo(0)
    }
  }

  renderHeader() {
    const {proposalStep, packageCode} = this.props.params
    let header = null
    let stepBarIndex = 0
    switch (proposalStep) {
      case 'quote':
        header = 'Quote'
        stepBarIndex = 0
        break
      case 'organProposerInfo':
        header = 'Company Info'
        stepBarIndex = 1
        break
      case 'proposerInfo':
        header = 'Policyholder Info'
        stepBarIndex = 1
        break
      case 'insuredInfo':
        header = 'Insured Info'
        stepBarIndex = 1
        break
      case 'paymentInfo':
        header = 'Payment Info'
        stepBarIndex = 2
        break
      case 'checkOrder':
        header = 'Check Order'
        stepBarIndex = 3
        break
      case 'result':
        header = 'Result'
        stepBarIndex = 3
        break
      default:
        break
    }
    return (
      <Header title={header}/>
    )
  }

  renderContent() {
    if (!this.state.producerLoaded) {
      return null
    }
    const {proposalStep, packageCode} = this.props.params
    let proposalView = null
    switch (proposalStep) {
      case 'quote':
        proposalView = <QuoteView {...this.props} />
        break
      case 'organProposerInfo':
        proposalView = <OrganProposerInfoView {...this.props}/>
        break
      case 'proposerInfo':
        proposalView = <ProposerInfoView {...this.props}/>
        break
      case 'insuredInfo':
        proposalView = <InsuredInfoView {...this.props}/>
        break
      case 'paymentInfo':
        proposalView = <PaymentInfoView {...this.props}/>
        break
      case 'checkOrder':
        proposalView = <CheckOrderView {...this.props}/>
        break
      case 'result':
        proposalView = <ResultView {...this.props}/>
        break
      default:
        proposalView = <QuoteView {...this.props}/>
        break
    }
    return proposalView
  }
}
