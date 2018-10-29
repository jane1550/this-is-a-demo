import React from 'react'
import PropTypes from 'prop-types'
import './ProductView.scss'
import browserHistory from '../../../common/history'
import FoldableCard from './FoldableCard'
import BaseComponent from '../../../components/BaseComponent'
import Header from '../../../components/Header'
import {formatString, deepClone} from "../../../common/utils"
import clipboard from 'clipboard-polyfill'

const mockData = require('../../../mock/ProductDetail.json')

function getFeatureUrl(packageCode) {
  let res = `/static/packages/${packageCode}/feature.jpg`
  return res
}

function getCaseUrl(packageCode) {
  let res = `/static/packages/${packageCode}/case.jpg`
  return res
}

function getInsurerLogo(insurer) {
  if (!insurer) {
    return null
  }
  return `/static/insurers/${insurer.insurerCode}/logo.jpg`
}

const ageUnit = {
  "1": ' Years Old',
  "2": ' Half-Year',
  "3": ' Quarter',
  "4": ' Month',
  "5": ' Day',
  "0": 'NA',
}

const coveragePeriod = {
  "0": 'NA',
  "1": 'Whole Life',
  "2": '{0} Years',
  "3": 'To Age {0}',
  "4": '{0} Months',
  "5": '{0} Days',
}

const chargePeriod = {
  "0": 'NA',
  "1": 'Single Premium',
  "2": '{0} Years',
  "3": 'To Age {0}',
  "4": 'Whole Life',
}

export default class ProductView extends BaseComponent {
  constructor(props) {
    super(props)
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
      return
    }
    if (
      !msg && !sign && !sessionStorage.getItem('SALES_APP_MSG') && !sessionStorage.getItem('SALES_APP_SIGN')
    ) {
      callback && callback(null)
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
      return
    }
    let producerInSession = sessionStorage.getItem('SALES_APP_PRODUCER')
    if (producerInSession) {
      let producer = JSON.parse(producerInSession)
      this.props.actions.setProducer(producer)
      callback && callback(producer)
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
        return
      }
      callback && callback(producer)
    })
  }

  componentDidMount() {
    this.loadProducer()
    const {packageCode} = this.props.params
    if (this.props.product && this.props.product.salesPackageInfo.packageCode == packageCode) {
      return
    }
    const reqBody = {salesPackageCode: packageCode, tenantCode: "eBao"}
    this.props.actions.getProduct(reqBody, (err, data) => {
      if (err) {
        this.alert('Failed to get product', 'Error')
      }
    });
  }

  renderRightsList(salesPackageInfo) {
    return (
      <div className='d-flex flex-wrap m-2'>
        {salesPackageInfo.salesRightsList.map(data => (
          <span className='col-6 col-md-4 col-lg-3 p-2' key={data.displayOrder}>
            <i className='far fa-check-square text-primary mr-2' style={{width: '20px'}}/>{data.rightWords}
          </span>
        ))}
      </div>
    )
  }

  renderSalesList(salesPackageInfo) {
    return (
      <div className='list-group'>
        {salesPackageInfo.salesLiabilityList.map(data => (
          <a className='list-group-item list-group-item-action flex-column align-items-start' key={data.liabId}>
            <div className='d-flex w-100 justify-content-between'>
              <h5 className='mb-1'>{data.liabName} </h5>
            </div>
            <p className='mb-0'>{data.liabDesc}</p>
          </a>
        ))}
      </div>
    )
  }

  renderProductList(salesPackageInfo) {
    const pdlist = salesPackageInfo.attachProductList.filter(data => data.packageCode)
    return (
      <div className='list-group'>
        {pdlist.map(data => (
          <a className='list-group-item list-group-item-action' key={data.productId}>
            {data.productName}
          </a>
        ))}
      </div>
    )
  }

  renderRiderList(salesPackageInfo) {
    const mock = salesPackageInfo.attachProductList.filter(data => !data.packageCode)
    if (mock.length === 0) {
      return null
    }
    return (
      <FoldableCard title='Recommended Riders'>
        <div className='list-group'>
          {mock.map(data => (
            <a className='list-group-item list-group-item-action' key={data.productId}>
              {data.productName}
            </a>
          ))}
        </div>
      </FoldableCard>
    )
  }

  mergePeriods(periods, excludeTypes = ["0", "1"]) {
    let mergedPeriods = [];
    for (let period of periods) {
      let lastIndex = mergedPeriods.length - 1;
      if (lastIndex < 0 || excludeTypes.includes(period.periodType)) {
        mergedPeriods.push(deepClone(period));
      } else {
        let lastMergedPeriod = mergedPeriods[lastIndex];
        let lastMergedPeriodType = lastMergedPeriod.periodType;
        if (lastMergedPeriodType !== period.periodType) {
          mergedPeriods.push(deepClone(period));
        } else {
          let lastMergedPeriodValue = lastMergedPeriod.periodValue;
          if (lastMergedPeriodValue.toString().indexOf('-') > -1) {
            let splitArray = lastMergedPeriodValue.split('-');
            let endValue = splitArray[1];
            if (parseInt(endValue) + 1 === period.periodValue) {
              let newValue = splitArray[0] + '-' + period.periodValue.toString();
              lastMergedPeriod.periodValue = newValue;
            } else {
              mergedPeriods.push(deepClone(period));
            }
          } else if (lastMergedPeriodValue + 1 === period.periodValue) {
            lastMergedPeriod.periodValue = lastMergedPeriod.periodValue.toString() +
              '-' + period.periodValue.toString();
          } else {
            mergedPeriods.push(deepClone(period));
          }
        }
      }
    }
    return mergedPeriods;
  }

  translateCoveragePeriod(periodType, periodValue) {
    return formatString(coveragePeriod[periodType.toString()], periodValue)
  }

  translateChargePeriod(periodType, periodValue) {
    return formatString(chargePeriod[periodType.toString()], periodValue)
  }

  shareLink() {
    let url = location.href
    let introducerCode = sessionStorage.getItem("SALES_APP_INTRODUCER_CODE")
    let agentCode = sessionStorage.getItem('SALES_APP_SHARE_AGENT_CODE')
    const producerInSession = sessionStorage.getItem('SALES_APP_PRODUCER')
    if (producerInSession) {
      const producer = JSON.parse(producerInSession)
      introducerCode = producer.producerCode
      if (producer.producerType === "1") {
        agentCode = producer.extraProperties.agentCode
      }
    }
    if (url.indexOf('?') < 0 && introducerCode) {
      url += `?introducerCode=${encodeURIComponent(introducerCode)}`
    } else if (url.indexOf('introducerCode=') < 0 && introducerCode) {
      url += `&introducerCode=${encodeURIComponent(introducerCode)}`
    }
    if (url.indexOf('?') < 0 && agentCode) {
      url += `?agentCode=${encodeURIComponent(agentCode)}`
    } else if (url.indexOf('agentCode=') < 0 && agentCode) {
      url += `&agentCode=${encodeURIComponent(agentCode)}`
    }
    clipboard.writeText(url)
    this.alert('Share Link has been copied to clipboard')
  }

  renderHeader() {
    return (
      <Header title='Product Details'
              rightComponent={<i className="fa fa-share-alt" onClick={this.shareLink.bind(this)}/>}/>
    )
  }

  renderContent(salesPackageInfo) {
    const {product} = this.props;
    if (!product) {
      return null
    }
    return (

      <div style={{height: '100%'}}>

        <div className='d-flex p-2 align-items-center justify-content-between border-bottom'>
          <h5 className='p-2'>{product.salesPackageInfo.packageName}</h5>
          <img width='120' src={getInsurerLogo(product.salesPackageInfo.insurer)}/>
        </div>
        <FoldableCard title='Insurance Conditions'>
          <div className='d-flex flex-wrap m-2'>
            <span className='m-2'>
              <i className='fas fa-birthday-cake text-success mr-2'
                 style={{width: '20px'}}/>Age: {product.salesPackageInfo.ageRange.minAge}{ageUnit[product.salesPackageInfo.ageRange.minUnit]} - {product.salesPackageInfo.ageRange.maxAge}{ageUnit[product.salesPackageInfo.ageRange.maxUnit]}
            </span>
            <span className='m-2'>
              <i className='fas fa-credit-card text-success mr-2' style={{width: '20px'}}/>
              Charge Period: {this.mergePeriods(product.salesPackageInfo.chargeList).map((chargePeriod) => this.translateChargePeriod(chargePeriod.periodType, chargePeriod.periodValue)).join(' / ')}
            </span>
            <span className='m-2'>
              <i className='fas fa-calendar-alt text-success mr-2' style={{width: '20px'}}/>
              Coverage Period: {this.mergePeriods(product.salesPackageInfo.coverageList).map((coveragePeriod) => this.translateCoveragePeriod(coveragePeriod.periodType, coveragePeriod.periodValue)).join(' / ')}
            </span>
          </div>
        </FoldableCard>
        <FoldableCard title='Protections'>
          {this.renderRightsList(product.salesPackageInfo)}
        </FoldableCard>
        <FoldableCard title='Product Feature'>
          <div className='d-flex justify-content-around m-2'>
            <div className='col-12 col-md-10 col-lg-8'>
              <img width='100%' src={getFeatureUrl(product.salesPackageInfo.packageCode)}/>

            </div>
          </div>
        </FoldableCard>
        <FoldableCard title='Case' collapsed>
          <div className='d-flex justify-content-around m-2'>
            <div className='col-12 col-md-10 col-lg-8'>
              <img width='100%' src={getCaseUrl(product.salesPackageInfo.packageCode)}/>
            </div>
          </div>
        </FoldableCard>
        <FoldableCard title='Liabilities' collapsed>
          {this.renderSalesList(product.salesPackageInfo)}
        </FoldableCard>
        <FoldableCard title='Product Package'>
          {this.renderProductList(product.salesPackageInfo)}
        </FoldableCard>
        {this.renderRiderList(product.salesPackageInfo)}
      </div>
    )
  }

  gotoProposal() {
    this.props.proposalActions.resetPage()
    const {packageCode} = this.props.params
    browserHistory.push(`/proposal/${packageCode}/quote`)
  }

  gotoQuotation() {
    this.props.proposalActions.resetPage()
    const {packageCode} = this.props.params
    browserHistory.push(`/proposal/${packageCode}/quote?type=plan`)
  }

  renderFooter() {
    return (
      <div className='action-footer p-1'>
        <button type='button' className='btn btn-primary btn-lg btn-block mt-0' style={{height: '70px'}}
                onClick={this.gotoQuotation.bind(this)}>Quotation
        </button>
        <button type='button' className='btn btn-success btn-lg btn-block mt-0' style={{height: '70px'}}
                onClick={this.gotoProposal.bind(this)}>Proposal
        </button>
      </div>
    )
  }
}
