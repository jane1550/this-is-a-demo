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
  FormToggle,
} from '../../../components/Forms'
import {
  formatDate,
  deepClone
} from '../../../common/utils'
import browserHistory from '../../../common/history'
import moment from 'moment'

import {jobCate, proposalStatus} from './const'

const YES_NO_OPTIONS = [
  {value: 'Y', label: 'Yes'},
  {value: 'N', label: 'No'},
]
const GENDER_OPTIONS = [
  {value: 'M', label: 'Male'},
  {value: 'F', label: 'Female'},
]
const LA_PH_RELA_OPTIONS = [
  {value: 1, label: 'Self'},
  {value: 2, label: 'Child'},
  {value: 3, label: 'Spouse'},
  {value: 4, label: 'Employee'},
  {value: 10, label: 'Parent'},
  {value: 7, label: 'Other'},
]
const LA_MAIN_RELA_OPTIONS = [
  {value: 2, label: 'Child'},
  {value: 3, label: 'Spouse'},
  {value: 10, label: 'Parent'},
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
export default class InsuredInfoView extends BaseComponent {
  constructor(props) {
    super(props)
    this.state = {
      insureds: [
        {
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
          nationality: '12',
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
          beneficiaries: [],
        },
      ],
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
    let insureds = deepClone(saveProposal.insureds)
    for (let insured of insureds) {
      insured.beneficiaries = saveProposal.beneficiaries.filter(bene => bene.insuredId == insured.id)
    }
    this.setState({insureds, mainCoverage: saveProposal.mainCoverages[0]})
  }

  onInsuredPropertyChange(insuredIndex, property, value, type) {
    let insureds = this.state.insureds
    if (type === 'int') {
      value = parseInt(value) || 0
    } else if (type === 'float') {
      value = parseFloat(value) || 0
    }
    insureds[insuredIndex][property] = value
    if (property === "laPhRela" && value == "1") {
      let orgId = insureds[insuredIndex].id
      Object.assign(insureds[insuredIndex], this.props.proposal.proposer)
      insureds[insuredIndex].id = orgId
    }
    this.setState({insureds})
  }

  onInsuredExtraPropertyChange(insuredIndex, property, value, type) {
    let insureds = this.state.insureds
    if (type === 'int') {
      value = parseInt(value) || 0
    } else if (type === 'float') {
      value = parseFloat(value) || 0
    }
    insureds[insuredIndex].extraProperties[property] = value
    this.setState({insureds})
  }

  onInsuredAdressPropertyChange(insuredIndex, property, value, type) {
    let insureds = this.state.insureds
    if (type === 'int') {
      value = parseInt(value) || 0
    } else if (type === 'float') {
      value = parseFloat(value) || 0
    }
    insureds[insuredIndex].addresses[0][property] = value
    this.setState({insureds})
  }

  save() {
    let insureds = this.state.insureds
    let validate = true
    for (let i = 0; i < insureds.length; i++) {
      if (this.refs[`insuredForm_${i}`]) {
        validate &= this.refs[`insuredForm_${i}`].valid()
      }
      if (this.refs[`insuredAddressForm_${i}`]) {
        validate &= this.refs[`insuredAddressForm_${i}`].valid()
      }
    }
    if (!validate) {
      this.toast('Please fill in all required fields!', 'error')
      return
    }
    let proposal = this.props.proposal
    for (let insured of insureds) {
      if (insured.laPhRela == 1) {
        let orgId = insured.id
        Object.assign(insured, proposal.proposer)
        insured.id = orgId
      }
    }
    let beneficiaries = []
    for (let insured of insureds) {
      beneficiaries.push(...insured.beneficiaries)
    }
    proposal.insureds = insureds
    proposal.beneficiaries = beneficiaries
    this.props.actions.setProposal(proposal)

    let order = {
      userCode: proposal.proposer.mobile,
      introducerCode: proposal.proposer.producerCode,
      insurerCode: proposal.salesCompanyCode,
      orderCode: proposal.proposalCode,
      order: proposal
    }
    this.validateProposalStatus(proposal.proposalCode, ["31", "80", "79", "82", "91"], () => {
      this.saveOrder(proposal, order => {
        this.props.actions.setProposal(order.order)
        const {quotationCode, proposalCode} = this.props.params
        let url = `/proposal/${this.props.params.packageCode}/paymentInfo/${quotationCode}/${proposalCode}`
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
    const {insureds, mainCoverage} = this.state
    return (
      <div style={{paddingBottom: '70px'}}>
        {insureds.map((insured, index) =>
          (
            <FormGroup key={`insuredForm_${index}`} ref={`insuredForm_${index}`} title={`Insured ${index + 1}`}
                       icon={<i className="fas fa-user text-primary"/>}>
              <FormSelect id={`insuredLaPhRela_${index}`} label="Relation with Policyholder: " required
                          blankOption="Please Select"
                          options={LA_PH_RELA_OPTIONS} value={insured.laPhRela}
                          hidden={index >= 1 && !insured.laPhRela} readOnly
                          onChange={value => this.onInsuredPropertyChange(index, 'laPhRela', value)}/>
              {insured.relationToMainInsured &&
              <FormSelect id={`insuredLaMainRela_${index}`} label="Relation with Main Insured: " required
                          blankOption="Please Select"
                          hidden={index < 1} readOnly
                          options={LA_MAIN_RELA_OPTIONS} value={insured.relationToMainInsured}
                          onChange={value => this.onInsuredPropertyChange(index, 'relationToMainInsured', value)}/>}
              <FormInput id={`insuredName_${index}`} label="Name: " required value={insured.name}
                         onChange={value => this.onInsuredPropertyChange(index, 'name', value)}
                         readOnly={insured.laPhRela == '1'}/>
              {insured.laPhRela != '1' &&
              <FormDate id={`insuredBirthday_${index}`} label="Birth Date: " required value={insured.birthday}
                        onChange={value => this.onInsuredPropertyChange(index, 'birthday', formatDate(value))} readOnly
                        minDate={moment(new Date()).add(-75, 'years')} maxDate={moment(new Date()).add(-15, 'days')}/>}
              {insured.laPhRela != '1' &&
              <FormRadio id={`insuredGender_${index}`} label="Gender: " required options={GENDER_OPTIONS}
                         value={insured.gender} readOnly
                         onChange={value => this.onInsuredPropertyChange(index, 'gender', value)}/>}
              {insured.laPhRela != '1' &&
              <FormInput id={`insuredCertiCode_${index}`} label="Identification Number: " required
                         value={insured.certiCode}
                         onChange={value => this.onInsuredPropertyChange(index, 'certiCode', value)}/>}
              {insured.laPhRela != '1' && insured.jobCateCode &&
              <FormSelect id={`insuredJobCateCode_${index}`} label="Occupation: " required blankOption="Please Select"
                          options={JOB_CATE} value={insured.jobCateCode} readOnly
                          onChange={value => this.onInsuredPropertyChange(index, 'jobCateCode', value)}/>}
              {insured.laPhRela != '1' && index < 1 &&
              <FormInput id={`insuredMobile_${index}`} label="Mobile: " required value={insured.mobile} type="tel"
                         tooltip={"Example +8613912345678"}
                         onChange={value => this.onInsuredPropertyChange(index, 'mobile', value)}
                         onBlur={value => this.onInsuredPropertyChange(index, 'mobile', value.startsWith('+') ? value : "+" + value)}
                         inputMask="(+99) 99999999999" valueUnmask={true}/>
              }
              {insured.laPhRela != '1' && index < 1 &&
              <FormInput id={`insuredEmail_${index}`} label="Email: " required value={insured.email} type="email"
                         onChange={value => this.onInsuredPropertyChange(index, 'email', value)}/>
              }
              {insured.laPhRela != '1' && !(mainCoverage.extraProperties && ["31"].includes(mainCoverage.extraProperties.benefitType)) &&
              <FormSelect id={`insuredMarriageStatus_${index}`} label="Marriage Status: " required
                          blankOption="Please Select"
                          options={MARRIAGE_STATUS} value={insured.marriageStatus}
                          onChange={value => this.onInsuredPropertyChange(index, 'marriageStatus', value)}/>
              }
              {insured.laPhRela != '1' && insured.smoking &&
              <FormRadio id={`insuredSmoking_${index}`} label="Smoking: " required options={YES_NO_OPTIONS} required
                         value={insured.smoking} readOnly
                         onChange={value => this.onInsuredPropertyChange(index, 'smoking', value)}/>
              }
              {insured.laPhRela != '1' && index < 1 && !(mainCoverage.extraProperties && ["31"].includes(mainCoverage.extraProperties.benefitType)) &&
              <FormGroup key={`insuredAddressForm_${index}`} ref={`insuredAddressForm_${index}`} title="Contact Address"
                         icon={<i className="fas fa-address-book text-primary"/>}>
                <FormInput id={`insuredProvince_${index}`} label="State/Province: " required
                           value={insured.addresses[0].province}
                           onChange={value => this.onInsuredAdressPropertyChange(index, 'province', value)}/>
                <FormInput id={`insuredCity_${index}`} label="City/Town: " value={insured.addresses[0].city}
                           onChange={value => this.onInsuredAdressPropertyChange(index, 'city', value)}/>
                <FormInput id={`insuredRegion_${index}`} label="Region/District: " value={insured.addresses[0].region}
                           onChange={value => this.onInsuredAdressPropertyChange(index, 'region', value)}/>
                <FormTextarea id={`insuredAddress_${index}`} label="Detail Address: " required
                              value={insured.addresses[0].address}
                              onChange={value => this.onInsuredAdressPropertyChange(index, 'address', value)}/>
                <FormInput id={`insuredPostCode_${index}`} label="Post Code: " required
                           value={insured.addresses[0].postCode}
                           onChange={value => this.onInsuredAdressPropertyChange(index, 'postCode', value)}/>
              </FormGroup>
              }
              <FormToggle label="Beneficiaries: " value={true} readOnly description="Legal"/>
            </FormGroup>
          )
        )}
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
