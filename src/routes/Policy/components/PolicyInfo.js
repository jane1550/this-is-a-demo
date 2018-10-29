import React from 'react'
import PropTypes from 'prop-types'
import {FormGroup, FormText} from "../../../components/Forms"
import {
  formatNumber, formatDate
} from '../../../common/utils'

const riskStatus = {
  0: "Waiting for Validate",
  1: "Inforced",
  2: "Lapsed",
  3: "Terminated",
}

const paymentFrequency = {
  "0": "Not Relevant",
  "1": "Yearly",
  "2": "Half-Yearly",
  "3": "Quarterly",
  "4": "Monthly",
  "5": "Single",
  "8": "Daily",
}

const currency = {
  1: "CNY",
  2: "GBP",
  3: "HKD",
  4: "USD",
  5: "CHF",
  8: "SGD",
  12: "JPY",
  13: "CAD",
  14: "AUD",
  16: "EUR",
  18: "NZD",
  20: "NOK",
  21: "THB",
  22: "DKK",
  23: "PHP",
  24: "SEK",
  25: "MOP",
  26: "TWD",
  27: "BND",
  28: "MYR",
  29: "LKR",
  30: "IDR",
  31: "INR",
  32: "VND",
}

function getMainInsuredName(policyInfo) {
  for (let coverage of policyInfo.coverages) {
    if (!coverage.masterCoverageNo) {
      return getInsuredNameByCoverage(policyInfo, coverage)
    }
  }
  return ''
}

function getPolicyHolderName(policyInfo) {
  let policyCustomer = policyInfo.policyHolder.policyCustomer
  if (!policyCustomer) {
    return ''
  }
  if (policyCustomer.person) {
    return [policyCustomer.person.firstName, policyCustomer.person.lastName].join(' ')
  } else if (policyCustomer.organization) {
    return policyCustomer.organization.companyName
  }
  return ''
}

function getInsuredNameByCoverage(policyInfo, coverage) {
  for (let coverageInsured of coverage.insureds) {
    if (coverageInsured.orderId === 1) {
      for (let insured of policyInfo.insureds) {
        if (insured.partyId === coverageInsured.insuredPartyId) {
          let policyCustomer = insured.policyCustomer
          if (policyCustomer) {
            return [policyCustomer.person.firstName, policyCustomer.person.lastName].join(' ')
          }
        }
      }
    }
  }
  return ''
}

function getChargePeriodLabel(periodType, periodValue) {
  if (periodType == 1) {
    return "Single Premium"
  } else if (periodType == 2) {
    return periodValue === 1 ? periodValue + " Year" : periodValue + " Years"
  } else if (periodType == 3) {
    return "To Age " + periodValue
  } else if (periodType == 4) {
    return "Whole Life"
  }
  return null
}

function getCoveragePeriodLabel(periodType, periodValue) {
  if (periodType == 1) {
    return "Whole Life"
  } else if (periodType == 2) {
    return periodValue === 1 ? periodValue + " Year" : periodValue + " Years"
  } else if (periodType == 3) {
    return "To Age " + periodValue
  }
  return null
}

function getPayType(mainCoverage) {
  if (mainCoverage.currentPremium.paymentFreq != "1") {
    return ` (${paymentFrequency[mainCoverage.paymentFreq.toString()]}) `
  } else {
    return null
  }
}

export const PolicyInfo = ({policyInfo}) => (
  <FormGroup title={<big className="text-primary">Policy Info</big>}>
    <FormText colSize="small" inline={false}
              label={<span className="text-secondary">Policy No.</span>}>{policyInfo.policyNumber}</FormText>
    <FormText colSize="small" inline={false}
              label={<span
                className="text-secondary">Policy Status</span>}>{riskStatus[policyInfo.riskStatus]}</FormText>
    <FormText colSize="small" inline={false}
              label={<span
                className="text-secondary">Commencement Date</span>}>{formatDate(policyInfo.inceptionDate)}</FormText>
    <FormText colSize="small" inline={false}
              label={<span className="text-secondary">End Date</span>}>{formatDate(policyInfo.expiryDate)}</FormText>
    <FormText colSize="small" inline={false}
              label={<span
                className="text-secondary">Main Insured Name</span>}>{getMainInsuredName(policyInfo)}</FormText>
    <FormText colSize="small" inline={false}
              label={<span
                className="text-secondary">Policyholder Name</span>}>{getPolicyHolderName(policyInfo)}</FormText>
    <FormText colSize="small" inline={false}
              label={<span
                className="text-secondary">Install Premium</span>}>{formatNumber(policyInfo.installPrem)}</FormText>
    <FormText colSize="small" inline={false}
              label={<span
                className="text-secondary">Currency</span>}>{currency[policyInfo.currency]}</FormText>
    <table className="m-2 table table-responsive-sm table-hover">
      <thead>
      <tr className="tr-middle text-center">
        <th scope="col">Benefit</th>
        <th scope="col">Insured Name</th>
        <th scope="col">Sum Assured</th>
        <th scope="col">Premium</th>
        <th scope="col">Charge Period</th>
        <th scope="col">Coverage Period</th>
      </tr>
      </thead>
      <tbody>
      {policyInfo.coverages.map((coverage, index) =>
        <tr key={index} className="tr-middle text-center">
          <td>{coverage.extendedProps.productName}</td>
          <td>{getInsuredNameByCoverage(policyInfo, coverage)}</td>
          <td>{coverage.currentPremium.sumAssured ? formatNumber(coverage.currentPremium.sumAssured) : '-'}</td>
          <td>{coverage.currentPremium.premium ? formatNumber(coverage.currentPremium.premium) : '-'} ({paymentFrequency[coverage.currentPremium.paymentFreq]})</td>
          <td>{getChargePeriodLabel(coverage.chargePeriod, coverage.chargeYear)}</td>
          <td>{getCoveragePeriodLabel(coverage.coveragePeriod, coverage.coverageYear)}</td>
        </tr>
      )}
      </tbody>
    </table>
  </FormGroup>
)
PolicyInfo.propTypes = {
  policyInfo: PropTypes.object,
}
export default PolicyInfo
