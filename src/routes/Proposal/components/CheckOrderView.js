/**
 * Created by haydn.chen on 4/4/2018.
 */
import React from 'react'
import BaseComponent from '../../../components/BaseComponent'
import './ProposalView.scss'
import {
  FormGroup,
  FormText,
  FormInput,
} from '../../../components/Forms'
import {
  formatNumber,
  getToday,
  getTomorrow,
  deepClone, getAgeByBirthday
} from '../../../common/utils'
import browserHistory from '../../../common/history'
import {jobCate, bankName, proposalStatus} from './const'
import Signature from '../../../components/Signature'
import PremiumTabel from './PremiumTabel'
import FormNumber from "../../../components/Forms/FormNumber"

const YES_NO_OPTIONS = {
  'Y': 'Yes',
  'N': 'No',
}
const GENDER_OPTIONS = {
  'M': 'Male',
  'F': 'Female',
}
const MARRIAGE_STATUS = {
  1: 'Married',
  2: 'Single',
  3: 'Divorced',
  4: 'Widowed',
  5: 'Separated',
  6: 'Other',
}
const LA_PH_RELA_OPTIONS = {
  1: 'Self',
  2: 'Child',
  3: 'Spouse',
  10: 'Parent',
  7: 'Other'
}

export default class CheckOrderView extends BaseComponent {
  constructor(props) {
    super(props)
    this.state = {
      proposal: {
        packageId: 5102480,
        packageCode: "TCPR01",
        packageName: "ACE Cash Back Protection",
        totalFirstYearPrem: null,
        annualPrem: null,
        proposalStatus: 31,
        inforceDate: getTomorrow(),
        submitDate: getToday(),
        moneyId: 30,
        insureds: [
          {
            id: '0',
            name: '',
            birthday: null,
            age: null,
            gender: 'M',
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
            laPhRela: 0,
            height: null,
            weight: null,
            smoking: 'N',
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
              householder: 'Y'
            },
            declaration: null,
          },
        ],
        organProposer: {
          id: '-1',
          addresses: [
            {
              province: '',
              city: '',
              region: '',
              address: '',
              postCode: '',
            },
          ],
          companyName: "",
          contact: "",
          contactTel: "",
          countryCode: "344",
          email: "",
          fax: "",
          homeTel: "",
          mobileTel: "",
          officeTel: "",
          officeTelExt: "",
          registerCode: "",
          registerType: "1001",
        },
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
          nationality: '12',
          marriageStatus: '',
          height: null,
          weight: null,
          income: null,
          smoking: 'N',
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
            householder: 'Y',
          },
          declaration: null,
        },
        beneficiaries: [],
        mainCoverages: [
          // 主险
          {
            itemId: 1,
            productId: 1000050,
            productCode: 'TCPR01',
            productName: 'ACE Cash Back Protection',
            paymentFreq: "4",
            unitFlag: 5, // 计算保费方式
            premium: 1200000,
            chargePeriod: {
              // 付款年限
              periodType: 2, // 年付／月付
              periodValue: 5, // 值，比如1年，2年
            },
            coveragePeriod: {
              // 保障周期
              periodType: 2, // 终身／年／到几岁
              periodValue: 10, // 值
            },
            insuredIds: ['0'], // 指向的被保人
          },
        ],
        riderCoverages: [],
        payerAccounts: [
          {
            paymentMethod: 1,
            paymentMethodNext: 1,
            bankAccount: null,
          }
        ],
        salesCompanyCode: 'CHUBB',
        salesChannelCode: 'CHUBB',
        serviceAgentCode: '20019',
      },
      proposerSignUrl: null,
      agentSignUrl: null,
      customer: null,
      sendDisabled: false,
      coldSeconds: 60,
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
    let proposal = deepClone(saveProposal)
    let customer = null
    if (proposal.producer && proposal.producer.producerType === "1"
      && proposal.proposer && this.props.customer && proposal.proposer.mobile === this.props.customer.mobile) {
      customer = deepClone(this.props.customer)
    } else if (proposal.producer && proposal.producer.producerType === "1" && proposal.proposer) {
      customer = {
        mobile: proposal.proposer.mobile,
        vcode: null,
        verified: false,
      }
    }
    this.setState({proposal, customer})
  }

  sendSms(e) {
    const {mobile} = this.state.customer;
    if (!mobile) {
      return
    }
    this.props.actions.sendSms(mobile.startsWith('+') ? mobile : '+86' + mobile, (err, data) => {
      if (err) {
        this.alert(err, 'Error')
      } else {
        this.toast('The verification code is send to your mobile')
        this.setState({
          sendDisabled: true,
          coldSeconds: 60,
        })
        this.timer = setInterval(() => {
          let coldSeconds = this.state.coldSeconds
          if (coldSeconds > 0) {
            coldSeconds = coldSeconds - 1
            this.setState({coldSeconds})
          } else {
            this.setState({sendDisabled: false})
            if (this.timer) {
              clearInterval(this.timer)
              this.timer = null
            }
          }
        }, 1000)
      }
    });
  }

  save() {
    this.verifyMobile(() => this.submitProposal())
  }

  submitProposal() {
    let newProposal = deepClone(this.props.proposal)
    let mainCoverage = newProposal.mainCoverages[0]
    newProposal.applyCode = null
    newProposal.policyCode = null
    if (!(mainCoverage.extraProperties && ["31"].includes(mainCoverage.extraProperties.benefitType))) {
      newProposal.inforceDate = getToday()
    }
    newProposal.submitDate = getToday()
    let saveProposalRequest = {
      proposal: newProposal,
      msg: sessionStorage.getItem('SALES_APP_MSG'),
      sign: sessionStorage.getItem('SALES_APP_SIGN'),
      tenantCode: sessionStorage.getItem('SALES_APP_TENANT_CODE'),
    }
    this.acceptProposal(saveProposalRequest, proposal => {
      //TODO 20180710 保单inforce
      saveProposalRequest.proposal = proposal
      this.issueProposal(saveProposalRequest, issueProposal => {
        if (this.timer) {
          clearInterval(this.timer)
          this.timer = null
        }
        const {quotationCode, proposalCode} = this.props.params
        let url = `/proposal/${this.props.params.packageCode}/result/${quotationCode}/${proposalCode}`
        browserHistory.push(url)
      })
    })
  }

  verifyMobile(callback) {
    if (this.state.customer && !this.state.customer.verified) {
      let validate = this.refs.vefifyCustomerForm.valid()
      if (!validate) {
        this.scrollTo()
        this.toast('Please fill in all required fields!', 'error')
      } else {
        let {mobile, vcode} = this.state.customer
        let mobileRequest = {
          mobile,
          verificationCode: vcode,
        }
        this.props.actions.verifyMobile(mobileRequest, (error, customer) => {
          if (error) {
            this.alert(error, 'Error')
          } else {
            this.setState({customer})
            callback && callback()
          }
        })
      }
    } else {
      callback && callback()
    }
  }

  acceptProposal(saveProposalRequest, callback) {
    if (["80", "91"].includes(saveProposalRequest.proposal.proposalStatus)) {
      callback && callback(saveProposalRequest.proposal)
    } else if (!["31", "79", "82"].includes(saveProposalRequest.proposal.proposalStatus)) {
      this.alert(`Proposal status is [${proposalStatus[saveProposalRequest.proposal.proposalStatus]}], can not continue`, 'Error')
    } else {
      this.props.actions.acceptProposal(saveProposalRequest, (error, proposal) => {
        if (error) {
          this.alert(error, 'Error')
          return
        }
        callback && callback(proposal)
      })
    }
  }

  issueProposal(saveProposalRequest, callback) {
    this.props.actions.issueProposal(saveProposalRequest, (error, proposal) => {
      if (error) {
        this.alert(error, 'Error')
        let oriProposal = saveProposalRequest.proposal
        oriProposal.proposalStatus = '91'
        this.props.actions.setProposal(oriProposal)
        let order = {
          userCode: oriProposal.proposer.mobile,
          introducerCode: oriProposal.proposer.producerCode,
          insurerCode: oriProposal.salesCompanyCode,
          orderCode: oriProposal.proposalCode,
          order: oriProposal
        }
        this.props.actions.saveProposal(order, (error, order) => {
          if (error) {
            this.alert(error, 'Error')
          } else {
            this.props.actions.setProposal(order.order)
          }
        })
      } else {
        this.props.actions.setProposal(proposal)
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
            this.props.actions.setProposal(order.order)
            callback && callback(proposal)
          }
        })
      }
    })
  }

  changeVcode(value) {
    let customer = this.state.customer
    customer.vcode = value
    this.setState({customer})
  }

  renderContent() {
    const {proposal, customer} = this.state
    const insureds = proposal.insureds
    const proposer = proposal.proposer
    const organProposer = proposal.organProposer
    const payerAccounts = proposal.payerAccounts
    const bankAccount = payerAccounts[0].bankAccount
    const mainCoverage = proposal.mainCoverages[0]
    return (
      <div style={{paddingBottom: '70px'}}>
        <FormGroup
          title={<div>Premium: <span className="text-success">{formatNumber(proposal.totalFirstYearPrem)}</span></div>}
          icon={<i className="far fa-credit-card text-primary"/>}>
          <PremiumTabel plan={this.state.proposal}/>
        </FormGroup>
        {organProposer ?
          <FormGroup ref="proposerForm" title="Company Info" icon={<i className="fas fa-building text-primary"/>}>
            <FormText id="companyName" label="Company Name: ">{organProposer.companyName}</FormText>
            <FormText id="registerCode" label="Register Code: ">{organProposer.registerCode}</FormText>
            <FormText id="contact" label="Contact Name: ">{organProposer.contact}</FormText>
            <FormText id="contactTel" label="Contact Tel No.: ">{organProposer.contactTel}</FormText>
            <FormText id="email" label="Email: ">{organProposer.email}</FormText>
            <FormText id="fax" label="Fax: ">{organProposer.fax}</FormText>
            <FormText id="officeTel" label="Office Phone No.: ">{organProposer.officeTel}</FormText>
            <FormText id="officeTelExt" label="Office Phone Ext: ">{organProposer.officeTelExt}</FormText>
            <FormGroup ref="proposerAddressForm" title="Company Address"
                       icon={<i className="fas fa-address-book text-primary"/>}>
              <FormText id="proposerProvince" label="State/Province: ">{organProposer.addresses[0].province}</FormText>
              <FormText id="proposerCity" label="City: ">{organProposer.addresses[0].city}</FormText>
              <FormText id="proposerRegion" label="Region/District: ">{organProposer.addresses[0].region}</FormText>
              <FormText id="proposerAddress" label="Detail Address: ">{organProposer.addresses[0].address}</FormText>
              <FormText id="proposerPostCode" label="Post Code: ">{organProposer.addresses[0].postCode}</FormText>
            </FormGroup>
          </FormGroup>
          :
          <FormGroup ref="proposerForm" title="Policyholder Info" icon={<i className="fas fa-user text-primary"/>}>
            <FormText id="proposerName" label="Name: ">{proposer.name}</FormText>
            <FormText id="proposerBirthday" label="Birth Date: ">{proposer.birthday}</FormText>
            <FormText id="proposerGender" label="Gender: ">{GENDER_OPTIONS[proposer.gender]}</FormText>
            <FormText id="proposerCertiCode" label="Identification Number: ">{proposer.certiCode}</FormText>
            {proposer.extraProperties.workplace &&
            <FormText id="proposerWorkplace"
                      label="Company Name: ">{proposer.extraProperties.workplace}</FormText>
            }
            {proposer.jobCateCode &&
            <FormText id="proposerJobCateCode" label="Occupation: ">{jobCate[proposer.jobCateCode]}</FormText>}
            <FormText id="proposerMobile" label="Mobile: ">{proposer.mobile}</FormText>
            <FormText id="proposerEmail" label="Email: ">{proposer.email}</FormText>
            {proposer.smoking &&
            <FormText id="proposerSmoking" label="Smoking: ">{YES_NO_OPTIONS[proposer.smoking]}</FormText>}
            <FormText id="proposerMarriageStatus"
                      label="Marriage Status: ">{MARRIAGE_STATUS[proposer.marriageStatus]}</FormText>
            {!(mainCoverage.extraProperties && ["31"].includes(mainCoverage.extraProperties.benefitType)) &&
            <FormGroup ref="proposerAddressForm" title="Contact Address"
                       icon={<i className="fas fa-address-book text-primary"/>}>
              <FormText id="proposerProvince" label="State/Province: ">{proposer.addresses[0].province}</FormText>
              <FormText id="proposerCity" label="City: ">{proposer.addresses[0].city}</FormText>
              <FormText id="proposerRegion" label="Region/District: ">{proposer.addresses[0].region}</FormText>
              <FormText id="proposerAddress" label="Detail Address: ">{proposer.addresses[0].address}</FormText>
              <FormText id="proposerPostCode" label="Post Code: ">{proposer.addresses[0].postCode}</FormText>
            </FormGroup>
            }
          </FormGroup>
        }

        {insureds.map((insured, index) => (
          <FormGroup key={`insuredForm_${index}`} ref={`insuredForm_${index}`} title={`Insured ${index + 1}`}
                     icon={<i className="fas fa-user text-primary"/>}>
            <FormText label="Name: ">{insured.name}</FormText>
            <FormText hidden={index > 1}
                      label="Relation with Policyholder: ">{LA_PH_RELA_OPTIONS[insured.laPhRela]}</FormText>
            <FormText hidden={index < 1}
                      label="Relation with Main Insured: ">{LA_PH_RELA_OPTIONS[insured.relationToMainInsured]}</FormText>
            {insured.laPhRela != '1' &&
            <FormText label="Birth Date: ">{insured.birthday}</FormText>}
            {insured.laPhRela != '1' &&
            <FormText label="Gender: ">{GENDER_OPTIONS[insured.gender]}</FormText>}
            {insured.laPhRela != '1' &&
            <FormText label="Identification Number: ">{insured.certiCode}</FormText>}
            {insured.laPhRela != '1' && insured.jobCateCode &&
            <FormText label="Occupation: ">{jobCate[insured.jobCateCode]}</FormText>}
            {insured.laPhRela != '1' &&
            <FormText label="Mobile: ">{insured.mobile}</FormText>
            }
            {insured.laPhRela != '1' &&
            <FormText label="Email: ">{insured.email}</FormText>
            }
            {insured.laPhRela != '1' &&
            <FormText label="Marriage Status: ">{MARRIAGE_STATUS[insured.marriageStatus]}</FormText>
            }
            {insured.laPhRela != '1' && insured.smoking &&
            <FormText label="Smoking: ">{YES_NO_OPTIONS[insured.smoking]}</FormText>
            }
            {insured.laPhRela != '1' && !(mainCoverage.extraProperties && ["31"].includes(mainCoverage.extraProperties.benefitType)) &&
            <FormGroup ref="insuredAddressForm" title="Contact Address"
                       icon={<i className="fas fa-address-book text-primary"/>}>
              <FormText id="mainInsuredProvince" label="State/Province: ">{insured.addresses[0].province}</FormText>
              <FormText id="mainInsuredCity" label="City/Town">{insured.addresses[0].city}</FormText>
              <FormText id="mainInsuredRegion" label="Region/District: ">{insured.addresses[0].region}</FormText>
              <FormText id="mainInsuredAddress" label="Detail Address: ">{insured.addresses[0].address}</FormText>
              <FormText id="mainInsuredPostCode" label="Post Code: ">{insured.addresses[0].postCode}</FormText>
            </FormGroup>
            }
            <FormText label="Beneficiaries: ">Legal</FormText>
          </FormGroup>
        ))}
        {(payerAccounts[0].paymentMethod === 1 || payerAccounts[0].paymentMethod === 80) ?
          <FormGroup ref="bankForm" title="Payment Info" icon={<i className="fas fa-credit-card text-primary"/>}>
            <FormText
              label="Payment Method: ">{payerAccounts[0].paymentMethod === 1 ? 'Cash' : '3rd Party Payment Platform'}</FormText>
          </FormGroup>
          :
          <FormGroup ref="bankForm" title="Payment Info" icon={<i className="fas fa-credit-card text-primary"/>}>
            <FormText
              label="Payment Method: ">{payerAccounts[0].paymentMethod === 30 ? 'Credit Card' : 'Debit Card'}</FormText>
            <FormText id="accoName" label="Account Name: ">{bankAccount.accoName}</FormText>
            <FormText id="bankAccount" label="Bank Account: ">{bankAccount.bankAccount}</FormText>
            <FormText id="bankCode" label="Bank Name: ">{bankName[bankAccount.bankCode]}</FormText>
            <FormText id="city" label="Bank of City: ">{bankAccount.bankAccountCity}</FormText>
          </FormGroup>
        }
        {customer &&
        <FormGroup ref="vefifyCustomerForm" title="Verify Customer Mobile"
                   icon={<i className="fas fa-credit-card text-primary"/>}>
          <FormInput id="proposerMobile" label="Mobile: " required value={customer.mobile} type="tel"
                     tooltip={"Example +8613912345678"} readOnly
                     inputMask="(+99) 99999999999" valueUnmask={true}
                     postfix={
                       customer.verified ?
                         <h3 className="text-success ml-2"><i id="verifiedIcon" className="fa fa-check-circle"
                                                              data-toggle="tooltip"
                                                              data-placement="right" title="Verified"/></h3>
                         :
                         <button className="btn btn-outline-secondary" type="button"
                                 onClick={this.sendSms.bind(this)}
                                 disabled={this.state.sendDisabled}>Send {this.state.sendDisabled ? `(${this.state.coldSeconds})` : ''}
                         </button>}/>
          {!customer.verified &&
          <FormInput label="Verification Code" required value={customer.vcode} onChange={this.changeVcode.bind(this)}/>}
        </FormGroup>
        }
        <div className="action-footer p-1 fixed-bottom">
          <button type="button" className="btn btn-secondary btn-lg btn-block mt-0" style={{height: '70px'}}
                  onClick={e => browserHistory.goBack()}>Prev
          </button>
          <button type="button" className="btn btn-primary btn-lg btn-block mt-0" style={{height: '70px'}}
                  onClick={this.save.bind(this)}>Submit
          </button>
        </div>
      </div>
    )
  }
}
