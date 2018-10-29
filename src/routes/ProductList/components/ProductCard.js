import React from 'react'
import PropTypes from 'prop-types'
import {formatString, deepClone} from '../../../common/utils'

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

export default class ProductCard extends React.Component {
  static propTypes = {
    salesPackage: PropTypes.object,
    onClick: PropTypes.func,
  }

  //将连续的coverage年（月日）合并，如1，2，3，4合并至1-4；coveragePeriods后台已排序
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

  render() {
    const {salesPackage, onClick} = this.props
    return (
      <div className="col-12 col-lg-6 mb-3">
        <div className="card" onClick={() => onClick && onClick(salesPackage.packageCode)}>
          <img className="card-img-top" src={`/static/img/${salesPackage.packageCode}.jpg`}
               alt={salesPackage.packageName}/>
          <div className="card-body">
            <h5 className="card-title">{salesPackage.insurer.abbrName} {salesPackage.packageName}</h5>
            <div className="card-text">
              <p className="mb-0">
                Age: {salesPackage.minAge}{ageUnit[salesPackage.minAgeUnit]} - {salesPackage.maxAge}{ageUnit[salesPackage.maxAgeUnit]}
                <br/>
                Coverage Period: {this.mergePeriods(salesPackage.coveragePeriods).map((coveragePeriod) => this.translateCoveragePeriod(coveragePeriod.periodType, coveragePeriod.periodValue)).join(' / ')}
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
