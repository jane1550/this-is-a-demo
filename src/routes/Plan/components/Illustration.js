import React from 'react'
import PropTypes from 'prop-types'
import FoldableCard from '../../Product/components/FoldableCard'
import {illusType} from './const'
import {
  formatNumber,
} from '../../../common/utils'

export default class Illustration extends React.Component {
  static propTypes = {
    illusMap: PropTypes.object,
    mainAssuredAge: PropTypes.number,
    moneyId: PropTypes.number,
  }

  constructor(props) {
    super(props)
    this.state = {
      illusPerformanceType: "2",
      illusYear: "1",
    }
  }

  getMinIllusYear() {
    const {illusMap} = this.props
    const {illusPerformanceType} = this.state
    let minIllusYear = 1;
    if (illusMap) {
      let illusPerformances = illusMap[illusPerformanceType];
      if (illusPerformances) {
        let illusPerformanceYears = Object.keys(illusPerformances);
        if (illusPerformanceYears.length > 0) {
          minIllusYear = parseInt(illusPerformanceYears[0]);
        }
      }
    }
    return minIllusYear;
  }

  getMaxIllusYear() {
    const {illusMap} = this.props
    const {illusPerformanceType} = this.state
    let maxIllusYear = 105;
    if (illusMap) {
      let illusPerformances = illusMap[illusPerformanceType];
      if (illusPerformances) {
        let illusPerformanceYears = Object.keys(illusPerformances);
        if (illusPerformanceYears.length > 0) {
          maxIllusYear = parseInt(illusPerformanceYears[illusPerformanceYears.length - 1]);
        }
      }
    }
    return maxIllusYear;
  }

  increaseIllusYear() {
    let illusYear = parseInt(this.state.illusYear);
    if ((illusYear + 1) <= this.getMaxIllusYear()) {
      this.setState({illusYear: (illusYear + 1).toString()})
    }
  }

  reduceIllusYear() {
    let illusYear = parseInt(this.state.illusYear);
    if ((illusYear - 1) >= this.getMinIllusYear()) {
      this.setState({illusYear: (illusYear - 1).toString()})
    }
  }

  renderOptions() {
    const {illusMap, mainAssuredAge} = this.props
    const {illusPerformanceType} = this.state
    let options = [];
    if (illusMap) {
      let illusPerformances = illusMap[illusPerformanceType];
      if (illusPerformances) {
        options = Object.keys(illusPerformances).map((i, index) =>
          <option key={index} value={i}>{parseInt(i) + mainAssuredAge}</option>);
      }
    }
    return options;
  }

  optionChange(value) {
    this.setState({illusYear: value});
  }

  renderIllusItem() {
    const {illusMap} = this.props
    const {illusPerformanceType, illusYear} = this.state
    let items = []
    if (illusMap) {
      let illusPerformances = illusMap[illusPerformanceType];
      if (illusPerformances) {
        let illusItems = illusMap[illusPerformanceType][illusYear];
        if (illusItems) {
          items = illusItems.map((illusItem, index) =>
            <tr className="tr-middle" key={index}>
              <td>{illusType[illusItem.type]}</td>
              <td className="text-right text-primary">{formatNumber(illusItem.value)}</td>
            </tr>
          );
        }
      }
    }
    return items
  }

  sliderChang(value) {
    this.setState({illusYear: value});
  }


  increaseIllusYear() {
    let illusYear = parseInt(this.state.illusYear);
    if ((illusYear + 1) <= this.getMaxIllusYear()) {
      this.setState({illusYear: (illusYear + 1).toString()})
    }
  }

  reduceIllusYear() {
    let illusYear = parseInt(this.state.illusYear);
    if ((illusYear - 1) >= this.getMinIllusYear()) {
      this.setState({illusYear: (illusYear - 1).toString()})
    }
  }

  hasPerformanceRate() {
    let {illusMap} = this.props;
    return illusMap && illusMap["1"] && illusMap["2"] && illusMap["3"];
  }

  render() {
    const {illusMap} = this.props
    const {illusPerformanceType} = this.state
    if (illusMap && (!illusMap["2"] || Object.keys(illusMap["2"]).length === 0)) {
      return null
    }
    return (
      <FoldableCard title="Illustration" collapsed collapse={false}>
        {this.hasPerformanceRate() &&
        <div className="d-flex justify-content-around mt-3">
          <h1 onClick={() => this.setState({illusPerformanceType: "1"})}><span
            className={"badge" + (illusPerformanceType === "1" ? " badge-primary" : "  badge-secondary")}>Low</span>
          </h1>
          <h1 onClick={() => this.setState({illusPerformanceType: "2"})}><span
            className={"badge" + (illusPerformanceType === "2" ? " badge-primary" : "  badge-secondary")}>Middle</span>
          </h1>
          <h1 onClick={() => this.setState({illusPerformanceType: "3"})}><span
            className={"badge" + (illusPerformanceType === "3" ? " badge-primary" : "  badge-secondary")}>High</span>
          </h1>
        </div>
        }
        <div className="d-flex">
          <table className="m-2 table flex-fill border-bottom table-hover">
            <thead>
            <tr className="tr-middle text-center">
              <th scope="col" className="border-top-0" colSpan={2}>
                <span className="mr-2">While the insured is</span>
                <select value={this.state.illusYear}
                        onChange={e => this.optionChange(e.target.value)}>
                  {this.renderOptions()}
                </select>
                <span className="ml-2">years old</span>
              </th>
            </tr>
            </thead>
            <tbody>
            {this.renderIllusItem()}
            </tbody>
          </table>
        </div>
        <div className="d-flex align-items-center p-3 mb-3">
          <div className="p-2">
            <h3 className="mb-0 text-primary"><i className="fas fa-minus" onClick={() => this.reduceIllusYear()}/></h3>
          </div>
          <div className="flex-fill p-2">
            <input type="range" className="custom-range" step={1}
                   min={this.getMinIllusYear()} max={this.getMaxIllusYear()}
                   value={this.state.illusYear} onChange={e => this.sliderChang(e.target.value)}/>
          </div>
          <div className="p-2">
            <h3 className="mb-0 text-primary"><i className="fas fa-plus" onClick={() => this.increaseIllusYear()}/></h3>
          </div>
        </div>
      </FoldableCard>
    )
  }
}
