import React from 'react'
import PropTypes from 'prop-types'
import './PlanView.scss'
import browserHistory from '../../../common/history'
import BaseComponent from "../../../components/BaseComponent"
import Header from '../../../components/Header'
import {
  formatNumber,
} from '../../../common/utils'
import PremiumTabel from '../../Proposal/components/PremiumTabel'
import FoldableCard from '../../Product/components/FoldableCard'
import clipboard from "clipboard-polyfill/build/clipboard-polyfill"
import Illustration from './Illustration'
import config from '../../../config'

const PAYMENT_TYPE = {
  '1': 'Yearly',
  '2': 'Half-Yearly',
  '3': 'Quarterly',
  '4': 'Monthly',
}

const GENDER = {
  'F': 'Female',
  'M': 'Male',
}

const MAX_AGE = 106

function getMaxCoverageYear(mainCoverage, mainInsuredAge) {
  let maxYear = mainCoverage.coveragePeriod.periodValue
  if (mainCoverage.coveragePeriod.periodType === 1) {
    maxYear = MAX_AGE - mainInsuredAge
  } else if (mainCoverage.coveragePeriod.periodType === 3) {
    maxYear =
      mainCoverage.coveragePeriod.periodValue - mainInsuredAge
  }
  return maxYear
}

function getInsurerLogo(insurerCode) {
  if (!insurerCode) {
    return null
  }
  return `/static/insurers/${insurerCode}/logo.jpg`
}

function getFeatureUrl(packageCode) {
  let res = `/static/packages/${packageCode}/feature.jpg`
  return res
}

function getChargePeriodLabel(chargePeriod) {
  if (chargePeriod.periodType == 1) {
    return "Single"
  } else if (chargePeriod.periodType == 2) {
    return chargePeriod.periodValue === 1 ? chargePeriod.periodValue + " Year" : chargePeriod.periodValue + " Years"
  } else if (chargePeriod.periodType == 3) {
    return "To Age " + chargePeriod.periodValue
  } else if (chargePeriod.periodType == 4) {
    return "Whole Life"
  }
  return null
}

function getCoveragePeriodLabel(coveragePeriod) {
  if (coveragePeriod.periodType == 1) {
    return "Whole Life"
  } else if (coveragePeriod.periodType == 2) {
    return coveragePeriod.periodValue === 1 ? coveragePeriod.periodValue + " Year" : coveragePeriod.periodValue + " Years"
  } else if (coveragePeriod.periodType == 4) {
    return coveragePeriod.periodValue === 1 ? coveragePeriod.periodValue + " Month" : coveragePeriod.periodValue + " Months"
  } else if (coveragePeriod.periodType == 5) {
    return coveragePeriod.periodValue === 1 ? coveragePeriod.periodValue + " Day" : coveragePeriod.periodValue + " Days"
  } else if (coveragePeriod.periodType == 3) {
    return "To Age " + coveragePeriod.periodValue
  }
  return null
}

function getPayType(mainCoverage) {
  if (mainCoverage.paymentFreq != "1" && PAYMENT_TYPE[mainCoverage.paymentFreq.toString()]) {
    return ` (${PAYMENT_TYPE[mainCoverage.paymentFreq.toString()]}) `
  } else {
    return null
  }
}

export default class PlanView extends BaseComponent {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    if (this.props.plan &&
      this.props.plan.quotationCode == this.props.params.quotationCode) {
      return
    }
    this.loadPage()
  }

  loadPage() {
    const {quotationCode} = this.props.params
    this.props.actions.getPlan(quotationCode, (error, plan) => {
      if (error) {
        this.alert(error, 'Error')
      } else {
        let packageDetailRequest = {
          salesPackageCode: plan.packageCode,
          tenantCode: plan.salesChannelCode,
        }
        this.props.actions.fetchPackageDetail(packageDetailRequest, (error, salesPackageInfo) => {
          if (error) {
            this.alert(error, 'Error')
          } else {
            //illustration
            if (getMaxCoverageYear(plan.mainCoverages[0], plan.insureds[0].age) > 1) {
              let illustrationCalcRequest = {
                plan,
                tenantCode: plan.salesChannelCode,
              }
              illustrationCalcRequest.performanceLevel = 2
              this.props.actions.fetchPlanIllustration(illustrationCalcRequest, (error, illusMap) => {
                if (error) {
                  this.alert(error, 'Error')
                } else {
                  if (salesPackageInfo.ilpProductIndi === 'Y') {
                    illustrationCalcRequest.performanceLevel = 1
                    this.props.actions.fetchPlanIllustration(illustrationCalcRequest, (error, illusMap) => {
                      if (error) {
                        this.alert(error, 'Error')
                      } else {
                        illustrationCalcRequest.performanceLevel = 3
                        this.props.actions.fetchPlanIllustration(illustrationCalcRequest, (error, illusMap) => {
                          if (error) {
                            this.alert(error, 'Error')
                          }
                        })
                      }
                    })
                  }
                }
              })
            }
          }
        })
        let mainCodes = plan.mainCoverages.map(coverage => coverage.productCode);
        let riderCodes = plan.riderCoverages.map(rider => rider.productCode);
        let productCodes = [...mainCodes, ...riderCodes].join(',');
        let productsLiabsRequest = {
          productCodes,
          salesPackageCode: plan.packageCode,
          tenantCode: plan.salesChannelCode,
        }
        this.props.actions.fetchProductsLiabs(productsLiabsRequest, (error, liabilitiesMap, funds) => {
          if (error) {
            this.alert(error, 'Error')
          }
        })
      }
    })
  }

  back() {
    browserHistory.go(-2)
  }

  gotoProposal() {
    if (!this.props.plan) {
      return
    }
    this.props.proposalActions.resetPage()
    browserHistory.push(`/proposal/${this.props.plan.packageCode}/quote/${this.props.plan.quotationCode}/0`)
  }

  shareLink() {
    let url = location.href
    if (url.indexOf('?') < 0) {
      url += `?viewMode=true`
    } else if (url.indexOf('viewMode=') < 0) {
      url += `&viewMode=true`
    }
    clipboard.writeText(url)
    this.alert('Share Link has been copied to clipboard')
  }

  viewPdf() {
    const {plan, illusMap, funds, salesPackageInfo} = this.props
    let illustrations = []
    if (illusMap && illusMap["2"]) {
      for (let key of Object.keys(illusMap["2"])) {
        let illustration = {
          policyYear: parseInt(key),
          policyAge: parseInt(key) + plan.insureds[0].age,
        }
        for (let illusItem of illusMap["2"][key]) {
          illustration[`calcType_${illusItem.type}`] = illusItem.value
        }
        if (illusMap["1"] && illusMap["1"][key]) {
          for (let lowItem of illusMap["1"][key]) {
            illustration[`calcType_${lowItem.type}_low`] = lowItem.value
          }
        }
        if (illusMap["3"] && illusMap["3"][key]) {
          for (let highItem of illusMap["3"][key]) {
            illustration[`calcType_${highItem.type}_high`] = highItem.value
          }
        }
        illustrations.push(illustration)
      }
    }
    let templateData = {
      plan,
      illustrations,
      investFunds: funds,
      ableRiders: salesPackageInfo.attachProductList.filter(rider => rider.insType !== "1").map(rider => {
        return {
          productCode: rider.productCode,
          productName: rider.productName,
        }
      })
    }
    let docRequest = {
      bizCode: plan.quotationCode,
      productCode: plan.packageCode,
      langId: plan.langCode,
      docType: 44,
      docData: JSON.stringify(templateData),
      archived: false,
    }
    this.props.actions.creatPdf(docRequest, (error, docId, docName) => {
      if (error) {
        this.alert(error, 'Error')
      } else {
        window.open(config.bffServiceBase + `/docs/download/${docId}/${docName}`, '_blank')
      }
    })
  }

  renderHeader() {
    let {viewMode} = this.props.location.query
    return (
      <Header title="Quotation" leftComponent={viewMode ? <span></span> : null}
              rightComponent={<i className="fa fa-share-alt" onClick={this.shareLink.bind(this)}/>}/>
    )
  }

  renderContent() {
    const {plan, salesPackageInfo, liabilitiesMap, illusMap} = this.props
    if (!plan) {
      return null
    }
    let liabList = []
    for (let [key, value] of Object.entries(liabilitiesMap)) {
      liabList.push(...value)
    }
    return (
      <div style={{height: '100%'}}>
        <div className="card">
          <h5 className="card-header d-flex justify-content-around align-items-center bg-white">
            <span>{plan.packageName}</span>
            <img width='120' src={getInsurerLogo(plan.salesCompanyCode)}/>
          </h5>
          <div className="card-body pl-0 pr-0 pb-0 bg-plan">
            <h5 className="card-title row ml-0 mr-0">
              <div className="col-6 text-right text-plan border-right">Policyholder</div>
              <div className="col-6 text-plan">Insured</div>
            </h5>
            <div className="card-text row ml-0 mr-0">
              <div className="col-6 text-right">
                <span className="text-white mr-2">{plan.proposer.name}</span>
                <span className="text-danger mr-2">{GENDER[plan.proposer.gender]}</span>
                <span className="text-warning">{plan.proposer.age}</span>
              </div>
              <div className="col-6 text-white">
                <span className="text-white mr-2">{plan.insureds[0].name}</span>
                <span className="text-danger mr-2">{GENDER[plan.insureds[0].gender]}</span>
                <span className="text-warning">{plan.insureds[0].age}</span>
              </div>
              <table className="mt-3 ml-0 mr-0 mb-0 table table-bordered table-responsive-sm table-hover">
                <thead>
                <tr className="tr-middle text-center text-plan">
                  <th scope="col">Sum Assured</th>
                  <th scope="col">Coverage Period</th>
                  <th scope="col">Charge Period</th>
                  <th scope="col">Premium{getPayType(plan.mainCoverages[0])}</th>
                </tr>
                </thead>
                <tbody>
                <tr className="tr-middle text-center text-white">
                  <td>{formatNumber(plan.mainCoverages[0].sa)}</td>
                  <td>{getCoveragePeriodLabel(plan.mainCoverages[0].coveragePeriod)}</td>
                  <td>{getChargePeriodLabel(plan.mainCoverages[0].chargePeriod)}</td>
                  <td>{formatNumber(plan.totalFirstYearPrem)}</td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="d-flex">
          <PremiumTabel plan={plan}/>
        </div>
        <Illustration illusMap={illusMap} mainAssuredAge={plan.insureds[0].age} moneyId={plan.moneyId}/>
        {liabList.length > 0 &&
        <FoldableCard title="Liabilities">
          <div className='list-group'>
            {liabList.map((liab, key) =>
              <a className='list-group-item list-group-item-action flex-column align-items-start' key={liab.liabId}>
                <div className='d-flex w-100 justify-content-between'>
                  <h5 className='mb-1'>{liab.liabName}</h5>
                  <small>{liab.categoryName}</small>
                </div>
                <p className='mb-0'>{liab.liabDesc}</p>
              </a>
            )}
          </div>
        </FoldableCard>
        }
        {salesPackageInfo &&
        <FoldableCard title='Protections'>
          <div className='d-flex flex-wrap m-2'>
            {salesPackageInfo.salesRightsList.map(data =>
              <span className='col-6 col-md-4 col-lg-3 p-2' key={data.displayOrder}>
                <i className='far fa-check-square text-primary mr-2' style={{width: '20px'}}/>{data.rightWords}
              </span>
            )}
          </div>
        </FoldableCard>
        }
        {salesPackageInfo &&
        <FoldableCard title='Product Feature'>
          <div className='d-flex justify-content-around m-2'>
            <div className='col-12 col-md-8 col-lg-6'>
              <img width='100%' src={getFeatureUrl(salesPackageInfo.packageCode)}/>
            </div>
          </div>
        </FoldableCard>
        }
      </div>
    )
  }

  renderFooter() {
    let {viewMode} = this.props.location.query
    return (
      <div className="action-footer p-1">
        <button type="button" className="btn btn-primary btn-lg btn-block mt-0" style={{height: '70px'}}
                onClick={this.viewPdf.bind(this)}>View PDF
        </button>
        {!viewMode && sessionStorage.getItem('SALES_APP_PRODUCER') &&
        <button type="button" className="btn btn-success btn-lg btn-block mt-0" style={{height: '70px'}}
                onClick={this.gotoProposal.bind(this)}>Proposal
        </button>
        }
      </div>
    )
  }
}
