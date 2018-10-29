/**
 * Created by haydn.chen on 4/4/2018.
 */
import React from 'react'
import BaseComponent from '../../../components/BaseComponent'
import './ProposalView.scss'
import {
  FormGroup,
  FormInput,
  FormText,
  FormSelect,
} from '../../../components/Forms'
import {
  formatNumber,
  deepClone
} from '../../../common/utils'
import browserHistory from '../../../common/history'
import {bankName, bankCode, proposalStatus} from './const'
import PremiumTabel from './PremiumTabel'
import FormRadio from "../../../components/Forms/FormRadio";
import FormField from "../../../components/Forms/FormField";

const BANK = Object.entries(bankName).map(([key, value]) => {
  return {value: key, label: value}
})

const PAYMENT_METHOD = [
  {value: 3, label: <span>&nbsp;Debit Card&nbsp;&nbsp;</span>},
  {value: 30, label: <span>&nbsp;Credit Card&nbsp;</span>},
  {value: 80, label: <span>&nbsp;LINE Pay&nbsp;&nbsp;&nbsp;&nbsp;</span>},
  {value: 1, label: <span>&nbsp;Cash&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>},
]

export default class PaymentInfoView extends BaseComponent {
  constructor(props) {
    super(props)
    this.state = {
      payerAccounts: [
        {
          paymentMethod: 3,
          paymentMethodNext: 3,
          bankAccount: {
            accoName: "",
            accountType: "2",
            bankAccount: "",
            bankAccountCity: "",
            bankCode: "",
          },
          extraProperties: {},
        },
      ],
      premium: null,
      password: ''
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
    let payerAccounts = deepClone(saveProposal.payerAccounts)
    if (payerAccounts[0].paymentMethod !== 1 && payerAccounts[0].paymentMethod !== 80) {
      if (!payerAccounts[0].bankAccount) {
        payerAccounts[0].bankAccount = {
          accoName: "",
          accountType: "2",
          bankAccount: "",
          bankAccountCity: "",
          bankCode: "",
        }
      }
      if (saveProposal.organProposer) {
        payerAccounts[0].bankAccount.accoName = saveProposal.organProposer.contact
      } else {
        payerAccounts[0].bankAccount.accoName = saveProposal.proposer.name
      }
    } else {
      payerAccounts[0].bankAccount = null
    }
    this.setState({payerAccounts})
  }

  onBankAccountPropertyChange(property, value, type) {
    let payerAccounts = this.state.payerAccounts
    if (type === 'int') {
      value = parseInt(value) || 0
    } else if (type === 'float') {
      value = parseFloat(value) || 0
    }
    payerAccounts[0].bankAccount[property] = value
    this.setState({payerAccounts})
  }

  onBankAccountExtraPropertyChange(property, value, type) {
    let payerAccounts = this.state.payerAccounts
    if (type === 'int') {
      value = parseInt(value) || 0
    } else if (type === 'float') {
      value = parseFloat(value) || 0
    }
    payerAccounts[0].bankAccount.extraProperties[property] = value
    this.setState({payerAccounts})
  }

  saveOrOpenPassword() {
    if (this.state.payerAccounts[0].paymentMethod === 80) {
      this.openPassword()
    } else {
      this.save()
    }
  }

  save() {
    let validate = this.refs.bankForm.valid()
    if (!validate) {
      this.toast('Please fill in all required fields!', 'error')
      return
    }
    let {payerAccounts} = this.state
    let {proposal} = this.props
    proposal.payerAccounts = payerAccounts
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
        let url = `/proposal/${this.props.params.packageCode}/checkOrder/${quotationCode}/${proposalCode}`
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

  paymentChange(value) {
    let {payerAccounts} = this.state
    if (value === 3) {
      payerAccounts[0].paymentMethod = 3
      payerAccounts[0].paymentMethodNext = 3
      payerAccounts[0].bankAccount = {
        accoName: "",
        accountType: "2",
        bankAccount: "",
        bankAccountCity: "",
        bankCode: "",
      }
      if (this.props.proposal.organProposer) {
        payerAccounts[0].bankAccount.accoName = this.props.proposal.organProposer.contact
      } else {
        payerAccounts[0].bankAccount.accoName = this.props.proposal.proposer.name
      }
    } else if (value === 30) {
      payerAccounts[0].paymentMethod = 30
      payerAccounts[0].paymentMethodNext = 30
      payerAccounts[0].bankAccount = {
        bankCode: '',
        bankAccount: '',
        accoName: '',
        accountType: '1',
        debitCreditType: '0',
        creditCardType: '1',
        bankAccountProvince: null,
        bankAccountCity: null,
      }
      if (this.props.proposal.organProposer) {
        payerAccounts[0].bankAccount.accoName = this.props.proposal.organProposer.contact
      } else {
        payerAccounts[0].bankAccount.accoName = this.props.proposal.proposer.name
      }
    } else {
      payerAccounts[0].paymentMethod = value
      payerAccounts[0].paymentMethodNext = value
      payerAccounts[0].bankAccount = null
    }
    this.setState({payerAccounts})
  }

  onPasswordChange(password) {
    this.setState({password})
    if (password.length >= 6) {
      this.closeModal()
      this.save()
    }
  }

  openPassword() {
    this.setState({password: ''})
    this.openModal(
      <div className="bg-light">
        <div className="text-center">
          <h1><i className="text-danger fas fa-unlock-alt"/></h1>
        </div>
        <div className="text-center">
          <h5><strong>LINE Pay Password</strong></h5>
        </div>
        <div className="text-center mb-4">
          <small>Please enter your LINE Pay password</small>
        </div>
        <div className="d-flex justify-content-around align-items-center text-center">
          <div className="col-8 col-lg-4">
            <FormInput id="password" type="password" pattern="[0-9]*" colSize="full" value={this.state.password}
                       inputMask="999999" valueUnmask={true}
                       onChange={password => this.onPasswordChange(password)}
                       inputStyle={{fontSize: '60px', height: '60px', textAlign: 'center'}}/>
          </div>
        </div>
        <div className="text-center mt-1 pb-3">
          <small>Forgot your password?</small>
        </div>
      </div>, <span></span>
    )
    setTimeout(() => {
      $("#password").focus()
    }, 500)
  }

  renderContent() {
    const {payerAccounts} = this.state
    const {proposal} = this.props
    let bankAccount = payerAccounts[0].bankAccount
    return (
      <div style={{paddingBottom: '70px'}}>
        {proposal &&
        <FormGroup
          title={<div>Premium: <span className="text-success">{formatNumber(proposal.totalFirstYearPrem)}</span></div>}
          icon={<i className="far fa-credit-card text-primary"/>}>
          <PremiumTabel plan={this.props.proposal}/>
        </FormGroup>}
        <FormGroup title="Payment Info" icon={<i className="fas fa-credit-card text-primary"/>}>
          <FormRadio label="Payment Method: " colSize="full" value={payerAccounts[0].paymentMethod}
                     options={PAYMENT_METHOD}
                     onChange={this.paymentChange.bind(this)}/>
          {payerAccounts[0].paymentMethod === 3 ?
            <FormGroup ref="bankForm">
              <FormInput id="accoName" label="Account Name: " required value={bankAccount.accoName}
                         onChange={value => this.onBankAccountPropertyChange('accoName', value)}/>
              <FormInput id="bankAccount" label="Bank Account: " required value={bankAccount.bankAccount}
                         onChange={value => this.onBankAccountPropertyChange('bankAccount', value)} pattern="[0-9]*"/>
              <FormSelect id="bankCode" label="Bank Name: " required blankOption="Please Select"
                          options={BANK} value={bankAccount.bankCode}
                          onChange={value => this.onBankAccountPropertyChange("bankCode", value)}/>
              <FormInput id="city" label="Bank of City: " required value={bankAccount.bankAccountCity}
                         onChange={value => this.onBankAccountPropertyChange('bankAccountCity', value)}/>
            </FormGroup> :
            payerAccounts[0].paymentMethod === 30 ?
              <FormGroup ref="bankForm">
                <FormInput id="accoName" label="Account Name: " required value={bankAccount.accoName}
                           onChange={value => this.onBankAccountPropertyChange('accoName', value)}/>
                <FormRadio id="creditCardType" label="Card Type: " required={true}
                           value={bankAccount.creditCardType}
                           options={[{value: "1", label: "Master"}, {value: "2", label: "Visa"}, {
                             value: "3",
                             label: "BCA"
                           }, {value: "4", label: "JCB"}]}
                           onChange={value => this.onBankAccountPropertyChange('creditCardType', value)}/>
                <FormInput id="bankAccount" label="Card No.: " required value={bankAccount.bankAccount}
                           inputMask="9999 9999 9999 9999" valueUnmask={true}
                           onChange={value => this.onBankAccountPropertyChange('bankAccount', value)}/>
                <FormSelect id="bankCode" label="Bank Name: " required blankOption="Please Select"
                            options={BANK} value={bankAccount.bankCode}
                            onChange={value => this.onBankAccountPropertyChange("bankCode", value)}/>
              </FormGroup>
              :
              payerAccounts[0].paymentMethod === 80 ?
                <FormGroup ref="bankForm">
                  <FormField colSize="full">
                    <div className="text-center">
                      <img className="col-8 col-lg-4" src={require('./Line_pay_logo.png')}
                           onClick={this.openPassword.bind(this)}/>
                    </div>
                  </FormField>
                </FormGroup>
                :
                <FormGroup ref="bankForm"/>
          }
        </FormGroup>
        <div className="action-footer p-1 fixed-bottom">
          <button type="button" className="btn btn-secondary btn-lg btn-block mt-0" style={{height: '70px'}}
                  onClick={e => browserHistory.goBack()}>Prev
          </button>
          <button type="button" className="btn btn-primary btn-lg btn-block mt-0" style={{height: '70px'}}
                  onClick={this.saveOrOpenPassword.bind(this)}>Next
          </button>
        </div>
      </div>
    )
  }
}
