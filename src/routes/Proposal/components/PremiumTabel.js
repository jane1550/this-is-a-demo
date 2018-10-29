import React from 'react'
import PropTypes from 'prop-types'
import {
  formatNumber,
} from '../../../common/utils'

const PAYMENT_TYPE = {
  '1': 'Yearly',
  '2': 'Half-Yearly',
  '3': 'Quarterly',
  '4': 'Monthly',
  '5': 'Single',
}

function getInsuredName(plan, insuredIds) {
  for (let insured of plan.insureds) {
    if (insured.id == insuredIds[0]) {
      return insured.name
    }
  }
  return ''
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

export const PremiumTable = ({plan}) => (
  <table className="m-2 table table-bordered table-responsive-sm table-hover">
    <thead>
    <tr className="tr-middle text-center">
      <th scope="col">Product Name</th>
      {plan.insureds.length > 1 &&
      <th scope="col">LA Name</th>
      }
      <th scope="col">Sum Assured</th>
      <th scope="col">Premium{getPayType(plan.mainCoverages[0])}</th>
      <th scope="col">Charge Period</th>
      <th scope="col">Coverage Period</th>
    </tr>
    </thead>
    <tbody>
    {plan.mainCoverages.map((main, index) => (
      <tr key={"main-product_" + index} className="tr-middle text-center">
        <td>{main.productName}</td>
        {plan.insureds.length > 1 &&
        <td>{getInsuredName(plan, main.insuredIds)}</td>
        }
        <td>{formatNumber(main.sa)}</td>
        <td>{formatNumber(main.premium)}</td>
        <td>{getChargePeriodLabel(main.chargePeriod)}</td>
        <td>{getCoveragePeriodLabel(main.coveragePeriod)}</td>
      </tr>
    ))}
    {plan.riderCoverages.map((rider, index) => (
      <tr key={"rider-product_" + index} className="tr-middle text-center">
        <td>{rider.productName}</td>
        {plan.insureds.length > 1 &&
        <td>{getInsuredName(plan, rider.insuredIds)}</td>
        }
        <td>{formatNumber(rider.sa)}</td>
        <td>{formatNumber(rider.premium)}</td>
        <td>{getChargePeriodLabel(rider.chargePeriod)}</td>
        <td>{getCoveragePeriodLabel(rider.coveragePeriod)}</td>
      </tr>
    ))}
    </tbody>
  </table>
)
PremiumTable.propTypes = {
  plan: PropTypes.object,
}
export default PremiumTable
