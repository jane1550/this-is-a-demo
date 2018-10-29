/**
 * Created by haydn.chen on 4/4/2018.
 */
import React from 'react'
import BaseComponent from '../../../components/BaseComponent'
import './ProposalView.scss'
import {
  FormGroup,
  FormInput,
  FormNumber,
  FormSelect,
  FormDate,
  FormTextarea,
  FormRadio,
} from '../../../components/Forms'
import {
  formatDate,
  deepClone
} from '../../../common/utils'
import moment from 'moment'
import browserHistory from '../../../common/history'
import {jobCate, proposalStatus} from './const'

const YES_NO_OPTIONS = [
  {value: 'Y', label: 'Yes'},
  {value: 'N', label: 'No'},
]
const GENDER_OPTIONS = [
  {value: 'M', label: 'Male'},
  {value: 'F', label: 'Female'},
]
const MARRIAGE_STATUS = [
  {value: 1, label: 'Married'},
  {value: 2, label: 'Single'},
  {value: 3, label: 'Divorced'},
  {value: 4, label: 'Widowed'},
  {value: 5, label: 'Separated'},
  {value: 6, label: 'Other'},
]
const JOB_CATE = Object.entries(jobCate).map(([key, value]) => {
  return {value: key, label: value}
})
export default class ProposerInfoView extends BaseComponent {
  constructor(props) {
    super(props)
    this.state = {
      proposer: {
        name: '',
        birthday: null,
        gender: 'M',
        age: null,
        jobCateId: 1,
        jobCateCode: '',
        certiType: 1,
        certiCode: '',
        certiBeginDate: null,
        certiEndDate: null,
        mobile: '',
        email: '',
        nationality: '99',
        marriageStatus: '',
        height: null,
        weight: null,
        income: null,
        addresses: [
          {
            province: '',
            city: '',
            region: '',
            address: '',
            postCode: '',
          },
        ],
        extraProperties: {
          workplace: '',
        },
        declaration: null,
      },
      mainCoverage: {
        paymentFreq: "1",
        unitFlag: 6, // 计算保费方式
        sa: 0, // 保额
        chargePeriod: {
          // 付款年限
          periodType: 1, // 年付／月付
          periodValue: 1, // 值，比如1年，2年
        },
        coveragePeriod: {
          // 保障周期
          periodType: 1, // 终身／年／到几岁
          periodValue: 0, // 值
        },
        insuredIds: ['0'], // 指向的被保人
        extraProperties: {}
      },
    }
  }

  componentDidMount() {
    const {proposalCode} = this.props.params
    if (this.props.proposal) {
      this.initPageState(this.props.proposal)
    } else if (proposalCode) {
      this.props.actions.getProposal(proposalCode, (error, proposal) => {
        if (error) {
          this.alert(error, 'Error')
        } else {
          this.initPageState(proposal)
        }
      })
    }
  }

  initPageState(saveProposal) {
    let proposer = deepClone(saveProposal.proposer)
    this.setState({proposer, mainCoverage: saveProposal.mainCoverages[0]})
  }

  onProposerPropertyChange(property, value, type) {
    let proposer = this.state.proposer
    if (type === 'int') {
      value = parseInt(value) || 0
    } else if (type === 'float') {
      value = parseFloat(value) || 0
    }
    proposer[property] = value
    this.setState({proposer})
  }

  onProposerExtraPropertyChange(property, value, type) {
    let proposer = this.state.proposer
    if (type === 'int') {
      value = parseInt(value) || 0
    } else if (type === 'float') {
      value = parseFloat(value) || 0
    }
    proposer.extraProperties[property] = value
    this.setState({proposer})
  }

  onProposerAddressPropertyChange(property, value, type) {
    let proposer = this.state.proposer
    if (type === 'int') {
      value = parseInt(value) || 0
    } else if (type === 'float') {
      value = parseFloat(value) || 0
    }
    proposer.addresses[0][property] = value
    this.setState({proposer})
  }

  save() {
    let validate = this.refs.proposerForm.valid()
    if (this.refs.proposerAddressForm) {
      validate &= this.refs.proposerAddressForm.valid()
    }
    if (!validate) {
      this.toast('Please fill in all required fields!', 'error')
      return
    }
    let {proposer, mainCoverage} = this.state
    let {proposal} = this.props
    proposal.proposer = proposer
    if (mainCoverage.extraProperties && ["31"].includes(mainCoverage.extraProperties.benefitType)) {
      proposer.addresses[0].address = "Just for Underwriting Rule"
      proposer.addresses[0].postCode = "000000"
    }
    for (let insured of proposal.insureds) {
      if (insured.laPhRela == 1) {
        let orgId = insured.id
        Object.assign(insured, proposal.proposer)
        insured.id = orgId
      }
    }
    this.props.actions.setProposal(proposal)
    this.validateProposalStatus(proposal.proposalCode, ["31", "80", "79", "82", "91"], () => {
      this.saveOrder(proposal, order => {
        this.props.actions.setProposal(order.order)
        const {quotationCode, proposalCode} = this.props.params
        let url = `/proposal/${this.props.params.packageCode}/insuredInfo/${quotationCode}/${proposalCode}`
        browserHistory.push(url)
      })
    })
  }

  validateProposalStatus(propocalCode, statusList, callback) {
    this.props.actions.getProposal(propocalCode, (error, proposal) => {
      if (error) {
        this.alert(error, 'Error')
      } else {
        if (statusList.includes(proposal.proposalStatus)) {
          callback && callback()
        } else {
          this.alert(`Proposal status is [${proposalStatus[proposal.proposalStatus]}], can not continue`, 'Error')
        }
      }
    })
  }

  saveOrder(proposal, callback) {
    let order = {
      userCode: proposal.proposer.mobile,
      introducerCode: proposal.proposer.producerCode,
      insurerCode: proposal.salesCompanyCode,
      orderCode: proposal.proposalCode,
      order: proposal
    }
    this.props.actions.saveProposal(order, (error, order) => {
      if (error) {
        this.alert(error, 'Error')
      } else {
        callback && callback(order)
      }
    })
  }

  renderContent() {
    const {proposer, mainCoverage} = this.state
    return (
      <div style={{paddingBottom: '70px'}}>
        <FormGroup ref="proposerForm" title="Policyholder Info" icon={<i className="fas fa-user text-primary"/>}>
          <FormInput id="proposerName" label="Name: " required value={proposer.name}
                     onChange={value => this.onProposerPropertyChange('name', value)}/>
          <FormDate id="proposerBirthday" label="Birth Date: " required value={proposer.birthday}
                    onChange={value => this.onProposerPropertyChange('birthday', formatDate(value))} readOnly
                    minDate={moment(new Date()).add(-75, 'years')} maxDate={moment(new Date()).add(-18, 'years')}/>
          <FormRadio id="proposerGender" label="Gender: " required options={GENDER_OPTIONS} required
                     value={proposer.gender} readOnly
                     onChange={value => this.onProposerPropertyChange('gender', value)}/>
          {typeof proposer.extraProperties.workplace !== "undefined" &&
          <FormInput id="proposerWorkplace" label="Company Name: " required
                     value={proposer.extraProperties.workplace}
                     onChange={value => this.onProposerExtraPropertyChange('workplace', value)}/>
          }
          {proposer.jobCateCode &&
          <FormSelect id="proposerJobCateCode" label="Occupation: " required blankOption="Please Select"
                      options={JOB_CATE} value={proposer.jobCateCode} readOnly
                      onChange={value => this.onProposerPropertyChange('jobCateCode', value)}/>}
          <FormInput id="proposerCertiCode" label="Identification Number: " required value={proposer.certiCode}
                     onChange={value => this.onProposerPropertyChange('certiCode', value)}/>
          <FormInput id="proposerMobile" label="Mobile: " required value={proposer.mobile} type="tel"
                     tooltip={"Example +8613912345678"}
                     readOnly={this.props.proposal && this.props.proposal.producer && this.props.proposal.producer.producerType === "2"}
                     onChange={value => this.onProposerPropertyChange('mobile', value)}
                     onBlur={value => this.onProposerPropertyChange('mobile', value.startsWith('+') ? value : "+" + value)}
                     inputMask="(+99) 99999999999" valueUnmask={true}/>
          <FormInput id="proposerEmail" label="Email: " required value={proposer.email} type="email"
                     onChange={value => this.onProposerPropertyChange('email', value)}/>
          {proposer.smoking &&
          <FormRadio id="proposerSmoking" label="Smoking: " required options={YES_NO_OPTIONS} required
                     value={proposer.smoking} readOnly
                     onChange={value => this.onProposerPropertyChange('smoking', value)}/>}
          <FormSelect id="proposerMarriageStatus" label="Marriage Status: " required blankOption="Please Select"
                      hidden={mainCoverage.extraProperties && ["31"].includes(mainCoverage.extraProperties.benefitType)}
                      options={MARRIAGE_STATUS} value={proposer.marriageStatus}
                      onChange={value => this.onProposerPropertyChange('marriageStatus', value)}/>
          {!(mainCoverage.extraProperties && ["31"].includes(mainCoverage.extraProperties.benefitType)) &&
          <FormGroup ref="proposerAddressForm" title="Contact Address"
                     icon={<i className="fas fa-address-book text-primary"/>}>
            <FormInput id="proposerProvince" label="State/Province: " required value={proposer.addresses[0].province}
                       onChange={value => this.onProposerAddressPropertyChange('province', value)}/>
            <FormInput id="proposerCity" label="City/Town: " value={proposer.addresses[0].city}
                       onChange={value => this.onProposerAddressPropertyChange('city', value)}/>
            <FormInput id="proposerRegion" label="Region/District: " value={proposer.addresses[0].region}
                       onChange={value => this.onProposerAddressPropertyChange('region', value)}/>
            <FormTextarea id="proposerAddress" label="Detail Address: " required value={proposer.addresses[0].address}
                          onChange={value => this.onProposerAddressPropertyChange('address', value)}/>
            <FormInput id="proposerPostCode" label="Post Code: " required value={proposer.addresses[0].postCode}
                       onChange={value => this.onProposerAddressPropertyChange('postCode', value)}/>
          </FormGroup>
          }
        </FormGroup>
        <div className="action-footer p-1 fixed-bottom">
          <button type="button" className="btn btn-secondary btn-lg btn-block mt-0" style={{height: '70px'}}
                  onClick={e => browserHistory.goBack()}>Prev
          </button>
          <button type="button" className="btn btn-primary btn-lg btn-block mt-0" style={{height: '70px'}}
                  onClick={this.save.bind(this)}>Next
          </button>
        </div>
      </div>
    )
  }
}
