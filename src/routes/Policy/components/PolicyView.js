import React from 'react'
import PropTypes from 'prop-types'
import './PolicyView.scss'
import BaseComponent from "../../../components/BaseComponent"
import Header from "../../../components/Header"
import {FormGroup, FormText} from "../../../components/Forms"
import {formatNumber, formatDate} from "../../../common/utils"
import PolicyInfo from './PolicyInfo'

const policyInfo = {
  "extendedProps": {},
  "serializedExtensionObj": null,
  "policyType": 1,
  "applyDate": "2018-09-17T00:00:00",
  "submissionDate": "2018-09-17T00:00:00",
  "inceptionDate": "2018-09-17T00:00:00",
  "issueDate": "2018-09-17T00:00:00",
  "expiryDate": "9999-09-09T00:00:00",
  "preDefinedPolicyNumber": null,
  "preDefinedProposalNumber": null,
  "policyNumber": "0010008225",
  "preprintedProposalNumber": null,
  "proposalNumber": "0010008225",
  "groupProposalNumber": null,
  "quotationCode": null,
  "serviceAgentCode": null,
  "salesChannelCode": null,
  "deliverType": null,
  "discountType": "0",
  "currency": 1,
  "installPrem": 10600,
  "riskStatus": 1,
  "ePolicyDownloadUrl": null,
  "introducerNo": null,
  "proposalInfo": null,
  "policyPackage": null,
  "coverages": [
    {
      "extendedProps": {
        "productCode": "EBAOCI",
        "productName": "eBao Critical Illness"
      },
      "serializedExtensionObj": null,
      "coverageNo": "3249167",
      "chargePeriod": "2",
      "chargeYear": 10,
      "coveragePeriod": "1",
      "coverageYear": 0,
      "deferPeriod": 0,
      "insuredCategory": null,
      "masterCoverageNo": null,
      "masterProductCode": null,
      "productCode": "EBAOCI",
      "waiverExt": {
        "waiver": "N",
        "waivedSa": 0
      },
      "currentPremium": {
        "benefitLevel": null,
        "paymentFreq": "1",
        "sumAssured": 500000,
        "premium": 10600,
        "unit": 0
      },
      "nextPremium": {
        "benefitLevel": null,
        "paymentFreq": "1",
        "sumAssured": 500000,
        "premium": 10600,
        "unit": 0
      },
      "coverageAgents": [
        {
          "extendedProps": {},
          "serializedExtensionObj": null,
          "agentCode": null,
          "assignRate": 1
        }
      ],
      "payPlans": [],
      "insureds": [
        {
          "extendedProps": {},
          "serializedExtensionObj": null,
          "insuredPartyId": "2848192",
          "orderId": 1,
          "occupationClass": null,
          "age": null
        }
      ],
      "premInvestRates": [],
      "recurringTopup": null,
      "contractInvests": [],
      "mortgageRates": []
    }
  ],
  "policyHolder": {
    "extendedProps": {},
    "serializedExtensionObj": null,
    "partyId": "2848192",
    "policyCustomer": {
      "extendedProps": {},
      "serializedExtensionObj": null,
      "partyType": 1,
      "person": {
        "gender": "M",
        "birthdate": "1986-07-24",
        "certiType": 1,
        "certiCode": "111111222222",
        "certiStart": null,
        "certiEnd": null,
        "firstName": "Haydn Chen",
        "midName": null,
        "lastName": null,
        "nationality": "99",
        "preferredLifeIndi": "0",
        "smoking": "N",
        "occupationCode": null,
        "occupation": null,
        "income": null,
        "marriageStatus": null,
        "height": null,
        "weight": null,
        "salutation": null,
        "employerInfo": null
      },
      "organization": {
        "registerType": null,
        "registerCode": null,
        "countryCode": null,
        "companyName": null,
        "organCode": null
      },
      "partyContact": {
        "homeTel": null,
        "mobileTel": "+8613671678190",
        "officeTel": null,
        "officeTelExt": null,
        "email": "haydn.chen@ebaotech.com",
        "contact": null,
        "contactTel": null,
        "fax": null
      },
      "address": {
        "address1": "Shanghai",
        "address2": "",
        "address3": "",
        "address4": "111111",
        "postCode": "111111"
      }
    },
    "relationToLA": 1
  },
  "insureds": [
    {
      "extendedProps": {},
      "serializedExtensionObj": null,
      "partyId": "2848192",
      "policyCustomer": {
        "extendedProps": {},
        "serializedExtensionObj": null,
        "partyType": 1,
        "person": {
          "gender": "M",
          "birthdate": "1986-07-24",
          "certiType": 1,
          "certiCode": "111111222222",
          "certiStart": null,
          "certiEnd": null,
          "firstName": "Haydn Chen",
          "midName": null,
          "lastName": null,
          "nationality": "99",
          "preferredLifeIndi": "0",
          "smoking": "N",
          "occupationCode": null,
          "occupation": null,
          "income": null,
          "marriageStatus": null,
          "height": null,
          "weight": null,
          "salutation": null,
          "employerInfo": null
        },
        "organization": {
          "registerType": null,
          "registerCode": null,
          "countryCode": null,
          "companyName": null,
          "organCode": null
        },
        "partyContact": {
          "homeTel": null,
          "mobileTel": "+8613671678190",
          "officeTel": null,
          "officeTelExt": null,
          "email": "haydn.chen@ebaotech.com",
          "contact": null,
          "contactTel": null,
          "fax": null
        },
        "address": {
          "address1": "Shanghai",
          "address2": "",
          "address3": "",
          "address4": "111111",
          "postCode": "111111"
        }
      },
      "relationToPH": 1,
      "relationToMainInsured": 1,
      "medicalIndi": "N",
      "socialSecurityIndi": "N",
      "medicalExamIndi": "N"
    }
  ],
  "beneficiaries": [],
  "payerAccounts": [
    {
      "extendedProps": {},
      "serializedExtensionObj": null,
      "bankAccount": {
        "bankCode": "UNITTEST",
        "bankAccount": "12345678",
        "accoName": "Haydn Chen",
        "branchCode": "BANK_FOR_ZERO_ORG",
        "bankAccountProvince": null,
        "bankAccountCity": "Shanghai",
        "issueBankName": null,
        "accountType": "2",
        "debitCreditType": "0",
        "creditCardType": null,
        "expireDate": null
      },
      "nextBankAccount": {
        "bankCode": "UNITTEST",
        "bankAccount": "12345678",
        "accoName": "Haydn Chen",
        "branchCode": "BANK_FOR_ZERO_ORG",
        "bankAccountProvince": null,
        "bankAccountCity": "Shanghai",
        "issueBankName": null,
        "accountType": "2",
        "debitCreditType": "0",
        "creditCardType": null,
        "expireDate": null
      },
      "paymentMethod": 3,
      "paymentMethodNext": 3
    }
  ],
  "declarations": [],
  "agentDeclarations": []
}

export default class PolicyView extends BaseComponent {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.fetchPolicy()
  }

  fetchPolicy() {
    const {insurerCode, policyCode} = this.props.params
    this.props.actions.getPolicyData(insurerCode, policyCode, (err, data) => {
      if (err) {
        this.alert(err, 'Error')
      } else {

      }
    })
  }

  renderHeader() {
    return (
      <Header title='Policy'/>
    )
  }

  renderContent() {
    const {policyData} = this.props
    return (
      <div style={{height: '100%'}}>
        {policyData && <PolicyInfo policyInfo={policyData.policyInfo}/>}
      </div>
    )
  }
}
