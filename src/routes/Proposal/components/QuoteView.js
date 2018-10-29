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
  deepClone,
  formatString,
  formatNumber,
  getTomorrow,
  getToday,
  getAgeByBirthday,
} from '../../../common/utils'
import moment from 'moment'
import browserHistory from '../../../common/history'
import {jobCate, paymentFreq, chargePeriod, coveragePeriod, payPeriod, proposalStatus} from './const'
import PremiumTabel from './PremiumTabel'

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
const JOB_CATE = Object.entries(jobCate).map(([key, value]) => {
  return {value: key, label: value}
})

function fireOnChange(target) {
  if (!target) {
    return
  }
  if (document.createEventObject) {
    target.fireEvent("onchange");
  } else {
    let evt = document.createEvent("HTMLEvents");
    evt.initEvent("change", true, true);
    target.dispatchEvent(evt);
  }
}

const DEFAULT_JOB_CATE_LIST = [1, 2, 3, 4]
const MIN_PH_AGE = 18
const MAX_AGE = 106
const MAX_AMOUNT = 9999999999
const DEFAULT_NATIONALITY = '99'
export default class QuoteView extends BaseComponent {
  constructor(props) {
    super(props)
    this.state = {
      plan: {
        langCode: '011',
        packageId: null,
        packageCode: null,
        totalFirstYearPrem: 0,
        annualPrem: 0,
        proposalStatus: '31',
        inforceDate: getToday(),
        submitDate: getToday(),
        moneyId: 1,
        insureds: [
          {
            id: '0',
            name: '',
            birthday: null,
            age: null,
            gender: 'M',
            jobCateId: null,
            jobCateCode: null,
            certiType: 1,
            certiCode: '',
            certiBeginDate: null,
            certiEndDate: null,
            mobile: null,
            email: null,
            nationality: DEFAULT_NATIONALITY,
            marriageStatus: "6",
            laPhRela: 0,
            height: null,
            weight: null,
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
        ],
        proposer: {
          name: '',
          birthday: null,
          gender: 'M',
          age: null,
          jobCateId: null,
          jobCateCode: null,
          certiType: 1,
          certiCode: '',
          certiBeginDate: null,
          certiEndDate: null,
          mobile: null,
          email: null,
          nationality: DEFAULT_NATIONALITY,
          marriageStatus: "6",
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
        beneficiaries: [],
        mainCoverages: [
          // 主险
          {
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
            limits: {
              isMain: true,
              ageLimitList: [], // 所允许的付款年限列表
              benefitLevelList: [], // 档次列表
              amountLimitList: [], // SA / unit 限制
              premLimitList: [], // 保费的限制
              isPackageProduct: false, // 是否为组合产品
              attachCompulsory: false, // 是否捆绑销售
              pointToSecInsured: false, // 是否指向第二被保人
              pointToPH: false, // 是否指向投保人
              isWaiver: false, // 是否为豁免（附加险）
              isAnnuityProduct: false, // 是否年金产品
              isIlpProduct: false, // 是否投联险（主险）
              singleTopupPermit: false, // 是否允许单笔追加
              regularTopupPermit: false, // 是否允许定期追加
              partialWithdrawPermit: false, // 是否允许部分领取
              smokingIndi: false, // 吸烟是否影响
              jobIndi: false, // 职业是否相关
              socialInsureIndi: false, // 社保相关
              waiverChargeYearAdjustment: 0, // 豁免险付款修正
              jobCateList: [], // 职业等级列表
              incrementIndex: 1, // 保额最小单位 d
              funds: [], // 基金列表
              targetAthRateList: [], // 主附或附附约束
              ageRange: {}, // 投保年龄范围
              paymentFreqs: [], //交费方式
              familyType: false, //是否家庭险
              ally: false, //是否joint life
              regPartWithdrMinAmount: 0,
              regPartWithdrMaxAmount: MAX_AMOUNT,
              topupStartYear: 1,
              partialWithdrawStartYear: 1,
              regPartWitdrStartYear: 1,
              isUDRider: false,
              saList: [],
              benefitType: null,
            },
            extraProperties: {}
          },
        ],
        riderCoverages: [],
        showAdvice: 'Y',
        advice: '',
        salesCompanyCode: "eBao",
        salesChannelCode: sessionStorage.getItem("SALES_APP_TENANT_CODE"),
        payerAccounts: [
          {
            paymentMethod: 3,
            bankAccount: null,
            extraProperties: {},
          },
        ],
        extraProperties: {}
      },
    }
  }

  componentDidMount() {
    this.loadPage()
  }

  loadPage() {
    const salesPackageCode = this.props.params.packageCode
    const isQuotation = this.props.location.query.type === 'plan'
    if (this.props.plan && salesPackageCode == this.props.plan.packageCode) {
      let plan = this.props.plan
      if (
        !isQuotation &&
        this.props.proposal &&
        salesPackageCode == this.props.proposal.packageCode
      ) {
        plan = this.mergeProposal(this.props.proposal, this.props.plan)
      }
      console.log(plan)
      this.setState({plan})
    } else {
      let proposalCode = this.props.params.proposalCode
      let quotationCode = this.props.params.quotationCode
      if (proposalCode && proposalCode !== '0') {
        // from saved proposal
        this.props.actions.getProposal(proposalCode, (error, proposal) => {
          if (error) {
            this.alert(error, 'Error')
          } else {
            this.loadProductsMetadata(proposal.packageCode, proposal)
          }
        })
      } else if (quotationCode && quotationCode !== '0') {
        // from saved plan
        this.props.actions.getPlan(quotationCode, (error, plan) => {
          if (error) {
            this.alert(error, 'Error')
          } else {
            this.loadProductsMetadata(plan.packageCode, plan)
          }
        })
      } else {
        // new quote or proposal
        this.loadProductsMetadata(salesPackageCode)
      }
    }
  }

  loadProductsMetadata(salesPackageCode, proposal = null) {
    let params = {
      tenantCode: sessionStorage.getItem('SALES_APP_TENANT_CODE'),
      salesPackageCode,
    }
    if (proposal) {
      let productCodeList = [...proposal.mainCoverages, ...proposal.riderCoverages].map(product => product.productCode)
      params.productCodes = productCodeList.join(',')
    }
    this.props.actions.getPlanInitialData(params, (error, planInitData) => {
      if (error) {
        this.alert(error, 'Error')
        return
      }
      let plan = this.initPlanByData(planInitData)
      if (proposal) {
        plan = this.mergeProposal(proposal, plan)
      }
      console.log(plan)
      this.setState({plan})
    })
  }

  initPlanByData(planInitData) {
    let plan = {
      langCode: '011',
      packageCode: planInitData.packageCode,
      packageName: planInitData.packageName,
      showAdvice: 'N',
      advice: planInitData.suggestReason,
      totalFirstYearPrem: 0,
      annualPrem: 0,
      proposalStatus: '31',
      inforceDate: getToday(),
      submitDate: getToday(),
      moneyId: planInitData.salesProductConfigInfoList
        ? planInitData.salesProductConfigInfoList[0].moneyId
        : null,
      beneficiaries: [],
      payerAccounts: [
        {
          paymentMethod: 3,
          bankAccount: null,
        },
      ],
      salesCompanyCode: planInitData.salesInsurer.insurerCode,
      salesChannelCode: sessionStorage.getItem("SALES_APP_TENANT_CODE"),
      producer: null,
      introducerCode: sessionStorage.getItem("SALES_APP_INTRODUCER_CODE"),
      serviceAgentCode: null,
      extraProperties: {},
    }
    let insured = {
      id: '0',
      name: '',
      birthday: null,
      age: MIN_PH_AGE,
      gender: 'M',
      jobCateId: null,
      jobCateCode: null,
      certiType: 1,
      certiCode: '',
      certiBeginDate: null,
      certiEndDate: null,
      mobile: null,
      email: null,
      nationality: DEFAULT_NATIONALITY,
      marriageStatus: "6",
      laPhRela: 0,
      height: null,
      weight: null,
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
    }
    let ph = {
      name: '',
      age: MIN_PH_AGE,
      birthday: null,
      gender: 'M',
      jobCateId: null,
      jobCateCode: null,
      certiType: 1,
      certiCode: '',
      certiBeginDate: null,
      certiEndDate: null,
      mobile: null,
      email: null,
      nationality: DEFAULT_NATIONALITY,
      marriageStatus: "6",
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
      extraProperties: {},
      declaration: null,
    }

    let secInsured = {
      id: '1',
      name: '',
      age: MIN_PH_AGE,
      birthday: null,
      gender: 'M',
      jobCateId: null,
      jobCateCode: null,
      certiType: 1,
      certiCode: '',
      certiBeginDate: null,
      certiEndDate: null,
      mobile: null,
      email: null,
      nationality: DEFAULT_NATIONALITY,
      marriageStatus: "6",
      laPhRela: 0,
      height: null,
      weight: null,
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
    }
    let mainCoverages = []
    let riderCoverages = []
    let masterIndex = 1
    if (planInitData.salesProductConfigInfoList) {
      for (let [
        index,
        product,
      ] of planInitData.salesProductConfigInfoList.entries()) {
        let coverage = this.initCoverageAndLimitsByUnitFlag(product)
        if (product.insType === '1') {
          if (mainCoverages.length === 0) {
            coverage.itemId = masterIndex
            mainCoverages.push(coverage)
          } else {
            console.error('Multiple main product is not supported yet', product)
          }
        } else {
          riderCoverages.push(coverage)
        }
      }
    }
    for (let [index, coverage] of riderCoverages.entries()) {
      coverage.masterItemId = masterIndex
      coverage.itemId = this.getNewItemIndex()
    }
    // init roles age and gender after limits set;
    let insureds = []
    insureds.push(insured)
    if (this.shouldHave2ndInsured(planInitData.salesProductConfigInfoList)) {
      insureds.push(secInsured)
    }
    plan.insureds = insureds
    plan.proposer = ph
    plan.mainCoverages = mainCoverages
    plan.riderCoverages = riderCoverages
    // set producer's serviceAgentCode in the company of this product if he has
    let producerInSession = sessionStorage.getItem('SALES_APP_PRODUCER')
    if (producerInSession) {
      plan.producer = JSON.parse(producerInSession)
      plan.serviceAgentCode = plan.producer.extraProperties.agentCode || '001'
      if (plan.producer.producerType === "2") {
        plan.proposer.name = plan.producer.producerName
        plan.proposer.birthday = plan.producer.birthDate
        if (plan.proposer.birthday) {
          plan.proposer.age = getAgeByBirthday(plan.proposer.birthday)
        }
        plan.proposer.gender = plan.producer.gender || 'M'
        plan.proposer.certiType = plan.producer.certiType
        plan.proposer.certiCode = plan.producer.certiCode
        plan.proposer.mobile = plan.producer.producerPhone
        plan.proposer.email = plan.proposer.producerEmail
      }
    }
    this.insuredModel = deepClone(insured)
    return plan
  }

  shouldHave2ndInsured(productList = []) {
    for (let product of productList) {
      if (product.pointToSecInsured === 'Y') {
        return true
      }
    }
    return false
  }

  getNewItemIndex() {
    let newIndex = this.riderItemIndex
    for (let coverage of this.state.plan.riderCoverages) {
      if (coverage.itemId > newIndex) {
        newIndex = coverage.itemId
      }
    }
    this.riderItemIndex = newIndex + 1
    return this.riderItemIndex
  }

  initCoverageAndLimitsByUnitFlag(product) {
    let coverage = {
      productName: product.salesProductName,
      productCode: product.salesProductCode,
      productId: product.salesProductId,
      unitFlag: product.unitFlag,
      paymentFreq: product.paymentFreqs && product.paymentFreqs.length > 0 ? product.paymentFreqs[0] : 1,
      limits: {
        isMain: product.insType === '1',
        ageLimitList: product.ageLimitList || [], // 所允许的付款年限列表
        benefitLevelList: product.benefitLevelList || [], // 档次列表
        amountLimitList: product.amountLimitList || [], // SA / unit 限制
        premLimitList: product.premLimitList || [], // 保费的限制
        isPackageProduct: product.isPackageProduct === 'Y',
        attachCompulsory: product.attachCompulsory === '1' || product.attachCompulsory === 'Y',
        pointToSecInsured: product.pointToSecInsured === 'Y',
        pointToPH: product.pointToPH === 'Y',
        isWaiver: product.isWaiver === 'Y',
        isIlpProduct: false,
        isAnnuityProduct: product.isAnnuityProduct === 'Y',
        singleTopupPermit: false,
        regularTopupPermit: false,
        partialWithdrawPermit: false,
        smokingIndi: false,
        jobIndi: product.jobIndi === 'Y',
        socialInsureIndi: product.socialInsureIndi === 'Y',
        waiverChargeYearAdjustment: 0,
        jobCateList: product.jobCateList || [],
        incrementIndex: product.incrementIndex || 1,
        funds: product.funds,
        targetAthRateList: product.targetAthRateList || [],
        ageRange: product.ageRange,
        paymentFreqs: product.paymentFreqs ? product.paymentFreqs : [],
        familyType: product.familyType === "1",
        ally: product.ally === "1",
        regPartWithdrMinAmount: product.regPartWithdrMinAmount ? product.regPartWithdrMinAmount : 0,
        regPartWithdrMaxAmount: product.regPartWithdrMaxAmount ? product.regPartWithdrMaxAmount : MAX_AMOUNT,
        topupStartYear: product.topupStartYear ? product.topupStartYear : 1,
        partialWithdrawStartYear: product.partialWithdrawStartYear ? product.partialWithdrawStartYear : 1,
        regPartWitdrStartYear: product.regPartWitdrStartYear ? product.regPartWitdrStartYear : 1,
        isUDRider: product.isUDRider === "Y",
        saList: [],
        benefitType: product.benefitType,
      },
      extraProperties: {
        benefitType: product.benefitType
      }
    }
    if (product.unitFlag === "2") {
      if (coverage.limits.amountLimitList.length > 0) {
        let minAmount = coverage.limits.amountLimitList[0].minAmount
        let maxAmount = coverage.limits.amountLimitList[0].maxAmount
        let i = 0
        while ((minAmount + i * product.incrementIndex) <= maxAmount) {
          coverage.limits.saList.push(minAmount + i * product.incrementIndex)
          i++
        }
        coverage.sa = minAmount
      }
    }
    if (product.pointToSecInsured === 'Y') {
      coverage.insuredIds = ['1']
    } else if (product.pointToPH === 'Y') {
      coverage.insuredIds = ['-1']
    } else {
      coverage.insuredIds = ['0']
    }
    if (product.smokingIndi !== 'N' && product.smokingIndi !== '0') {
      coverage.limits.smokingIndi = product.smokingIndi
    }
    if (product.isWaiver === 'Y') {
      let waiverChargeYearAdjustment = product.waiverChargeYearAdjustment
      if (typeof waiverChargeYearAdjustment !== 'number') {
        waiverChargeYearAdjustment = -1
      }
      coverage.limits.waiverChargeYearAdjustment = waiverChargeYearAdjustment
    }
    if (product.benefitLevelList) {
      coverage.limits.benefitLevelList = [...product.benefitLevelList].sort((a, b) => {
        if (a.benefitLevel < b.benefitLevel) {
          return -1
        }
        if (a.benefitLevel > b.benefitLevel) {
          return 1
        }
        return 0
      })
      if (coverage.limits.benefitLevelList.length > 0) {
        coverage.benefitlevel = coverage.limits.benefitLevelList[0]
      }
    }
    // init ILP
    if (product.insType === '1' && product.isIlpProduct === 'Y') {
      coverage.limits.isIlpProduct = true
      coverage.investRates = []
      coverage.topupWithdraws = []
      if (product.regularTopupPermit === 'Y') {
        coverage.limits.regularTopupPermit = true
        let regularTopup = {
          startYear: 1,
          endYear: MAX_AGE,
          premType: '3',
          amount: 0,
        }
        coverage.topupWithdraws.push(regularTopup)
      }
      if (product.singleTopupPermit === 'Y') {
        coverage.limits.singleTopupPermit = true
      }
      if (product.partialWithdrawPermit === 'Y') {
        coverage.limits.partialWithdrawPermit = true
      }
    }
    return coverage
  }

  mergeProposal(proposal, plan) {
    proposal.mainCoverages[0].limits = plan.mainCoverages[0].limits
    for (let prider of proposal.riderCoverages) {
      for (let rider of plan.riderCoverages) {
        if (prider.productCode == rider.productCode) {
          prider.limits = rider.limits
        }
      }
    }
    return proposal
  }

  hasNoneYearPayment(paymentFreqs) {
    if (!paymentFreqs || paymentFreqs.length === 0) {
      return false
    }
    for (const paymentFreq of paymentFreqs) {
      if (paymentFreq !== "1" && paymentFreq !== "5") {
        return true
      }
    }
    return false
  }

  onPlanPropertyChange(property, value, type) {
    let plan = this.state.plan
    if (type === 'int') {
      value = parseInt(value) || 0
    } else if (type === 'float') {
      value = parseFloat(value) || 0
    }
    plan[property] = value
    this.setState({plan})
  }

  onPlanExtraPropertyChange(property, value, type) {
    let plan = this.state.plan
    if (type === 'int') {
      value = parseInt(value) || 0
    } else if (type === 'float') {
      value = parseFloat(value) || 0
    }
    plan.extraProperties[property] = value
    this.setState({plan})
  }

  onInsuredPropertyChange(insuredIndex, property, value, type) {
    let plan = this.state.plan
    if (type === 'int') {
      value = parseInt(value) || 0
    } else if (type === 'float') {
      value = parseFloat(value) || 0
    }
    if (property === 'birthday') {
      plan.insureds[insuredIndex].age = getAgeByBirthday(value)
    }
    if (property === 'laPhRela' && value == 1) {
      if (moment(plan.proposer.birthday).isAfter(this.getMaxInsuredBirthday(insuredIndex)) ||
        moment(plan.proposer.birthday).isBefore(this.getMinInsuredBirthday(insuredIndex))) {
        this.toast(`Policyholder's age is out of proposal age range`)
        return
      }
      plan.insureds[insuredIndex].name = plan.proposer.name
      plan.insureds[insuredIndex].birthday = plan.proposer.birthday
      plan.insureds[insuredIndex].age = plan.proposer.age
      plan.insureds[insuredIndex].gender = plan.proposer.gender
      plan.insureds[insuredIndex].smoking = plan.proposer.smoking
      plan.insureds[insuredIndex].jobCateId = plan.proposer.jobCateId
      plan.insureds[insuredIndex].jobCateCode = plan.proposer.jobCateCode
      plan.insureds[insuredIndex].extraProperties = plan.proposer.extraProperties
    }
    plan.insureds[insuredIndex][property] = value
    this.setState({plan}, () => {
      if (property === 'birthday' || property === 'gender' || property === 'laPhRela') {
        fireOnChange(document.getElementById('mainChargePeriod'))
      }
    })
  }

  onInsuredExtraPropertyChange(insuredIndex, property, value, type) {
    let plan = this.state.plan
    if (type === 'int') {
      value = parseInt(value) || 0
    } else if (type === 'float') {
      value = parseFloat(value) || 0
    }
    plan.insureds[insuredIndex].extraProperties[property] = value
    this.setState({plan})
  }

  onProposerPropertyChange(property, value, type) {
    let plan = this.state.plan
    if (type === 'int') {
      value = parseInt(value) || 0
    } else if (type === 'float') {
      value = parseFloat(value) || 0
    }
    plan.proposer[property] = value
    if (property === 'birthday') {
      plan.proposer.age = getAgeByBirthday(value)
      for (let insured of plan.insureds) {
        if (insured.laPhRela == 1) {
          insured.birthday = plan.proposer.birthday
          insured.age = plan.proposer.age
        }
      }
    }
    if (property === 'gender') {
      for (let insured of plan.insureds) {
        if (insured.laPhRela == 1) {
          insured.gender = plan.proposer.gender
        }
      }
    }
    this.setState({plan}, () => {
      if (property === 'birthday' || property === 'gender') {
        fireOnChange(document.getElementById('mainChargePeriod'))
      }
    })
  }

  onProposerExtraPropertyChange(property, value, type) {
    let plan = this.state.plan
    if (type === 'int') {
      value = parseInt(value) || 0
    } else if (type === 'float') {
      value = parseFloat(value) || 0
    }
    plan.proposer.extraProperties[property] = value
    this.setState({plan})
  }

  onMainCoveragePropertyChange(property, value, type) {
    let plan = this.state.plan
    if (type === 'int') {
      value = parseInt(value) || 0
    } else if (type === 'float') {
      value = parseFloat(value) || 0
    }
    plan.mainCoverages[0][property] = value
    this.setState({plan})
  }

  containsPeriod(periodList, period) {
    for (let p of periodList) {
      if (p.periodType === period.periodType && p.periodValue === period.periodValue) {
        return true
      }
    }
    return false
  }

  getMainCoverageChargePeriodOptions() {
    let periods = []
    let plan = this.state.plan
    let insured = plan.insureds[0]
    let ph = plan.proposer
    let insuredAge = insured.age
    let insuredGender = insured.gender
    let phAge = ph.age
    for (let ageLimit of plan.mainCoverages[0].limits.ageLimitList) {
      let period = {periodType: ageLimit.chargePeriod, periodValue: ageLimit.chargeYear}
      if (insuredAge >= ageLimit.minInsdAge && insuredAge <= ageLimit.maxInsdAge
        && (!ageLimit.gender || ageLimit.gender === "N" || ageLimit.gender === insuredGender) &&
        phAge >= ageLimit.minPhAge && phAge <= ageLimit.maxPhAge
        && !this.containsPeriod(periods, period)) {
        periods.push(period)
      }
    }
    return periods
  }

  getMainCoverageCoveragePeriodOptions() {
    let periods = []
    let plan = this.state.plan
    let insured = plan.insureds[0]
    let ph = plan.proposer
    let insuredAge = insured.age
    let insuredGender = insured.gender
    let phAge = ph.age
    let mainCoverage = plan.mainCoverages[0]
    let mainChargePeriod = mainCoverage.chargePeriod
    for (let ageLimit of plan.mainCoverages[0].limits.ageLimitList) {
      let period = {periodType: ageLimit.coveragePeriod, periodValue: ageLimit.coverageYear}
      if (insuredAge >= ageLimit.minInsdAge && insuredAge <= ageLimit.maxInsdAge
        && (!ageLimit.gender || ageLimit.gender === "N" || ageLimit.gender === insuredGender) &&
        phAge >= ageLimit.minPhAge && phAge <= ageLimit.maxPhAge
        && (!mainChargePeriod || (mainChargePeriod.periodType === ageLimit.chargePeriod && mainChargePeriod.periodValue === ageLimit.chargeYear))
        && !this.containsPeriod(periods, period)) {
        periods.push(period)
      }
    }
    return periods
  }

  getMainCoveragePayPeriodOptions() {
    let periods = []
    let plan = this.state.plan
    let insured = plan.insureds[0]
    let ph = plan.proposer
    let insuredAge = insured.age
    let insuredGender = insured.gender
    let phAge = ph.age
    let mainCoverage = plan.mainCoverages[0]
    let mainChargePeriod = mainCoverage.chargePeriod
    let mainCoveragePeriod = mainCoverage.coveragePeriod
    for (let ageLimit of plan.mainCoverages[0].limits.ageLimitList) {
      let period = {periodType: ageLimit.payPeriod, periodValue: ageLimit.payYear}
      if (insuredAge >= ageLimit.minInsdAge && insuredAge <= ageLimit.maxInsdAge
        && (!ageLimit.gender || ageLimit.gender === "N" || ageLimit.gender === insuredGender) &&
        phAge >= ageLimit.minPhAge && phAge <= ageLimit.maxPhAge
        && (!mainChargePeriod || (mainChargePeriod.periodType === ageLimit.chargePeriod && mainChargePeriod.periodValue === ageLimit.chargeYear))
        && ((!mainCoveragePeriod || (mainCoveragePeriod.periodType === ageLimit.coveragePeriod && mainCoveragePeriod.periodValue === ageLimit.coveragePeriod)))
        && !this.containsPeriod(periods, period)) {
        periods.push(period)
      }
    }
    return periods
  }

  generatePeriod(value) {
    let tokenizer = value.split('-')
    let period = {
      periodType: parseInt(tokenizer[0]),
      periodValue: parseInt(tokenizer[1]),
    }
    return period
  }

  onMainCoverageChargePeriodChange(value) {
    let plan = this.state.plan
    if (value) {
      plan.mainCoverages[0].chargePeriod = this.generatePeriod(value)
    } else {
      plan.mainCoverages[0].chargePeriod = null
    }
    console.log('mainChargePeriod', plan.mainCoverages[0].chargePeriod)
    this.setState({plan: plan}, () => {
      fireOnChange(document.getElementById('mainCoveragePeriod'))
    })
  }

  onMainCoverageCoveragePeriodChange(value) {
    let plan = this.state.plan
    if (value) {
      plan.mainCoverages[0].coveragePeriod = this.generatePeriod(value)
    } else {
      plan.mainCoverages[0].coveragePeriod = null
    }
    console.log('mainCoveragePeriod', plan.mainCoverages[0].coveragePeriod)
    this.setState({plan: plan}, () => {
      fireOnChange(document.getElementById('mainPayPeriod'))
    })
  }

  onMainCoveragePayPeriodChange(value) {
    let plan = this.state.plan
    if (value) {
      plan.mainCoverages[0].payPeriod = this.generatePeriod(value)
    } else {
      plan.mainCoverages[0].payPeriod = null
    }
    console.log('mainPayPeriod', plan.mainCoverages[0].payPeriod)
    this.setState({plan: plan})
  }

  canHidePayPeriod() {
    let payPeriods = this.getMainCoveragePayPeriodOptions()
    return payPeriods.length === 1 && payPeriods[0].periodType === 0
  }

  getPointToPerson(coverage) {
    let plan = this.state.plan
    let insured = plan.insureds[0]
    let ph = plan.proposer
    let secInsured = plan.insureds[1]
    if (coverage.limits.pointToPH) {
      return ph
    } else if (coverage.limits.pointToSecInsured) {
      return secInsured
    } else {
      return insured
    }
  }

  getMinSaOrUnitByAge(coverage) {
    let minVale = 0
    let plan = this.state.plan
    let person = this.getPointToPerson(coverage)
    for (let amountLimit of coverage.limits.amountLimitList) {
      if (person.age >= amountLimit.minAge && person.age <= amountLimit.maxAge
        && (!amountLimit.moneyId || amountLimit.moneyId === plan.moneyId)
        && (!coverage.limits.jobIndi || !amountLimit.jobClass || amountLimit.jobClass === person.jobClass)
        && minVale < amountLimit.minAmount) {
        minVale = amountLimit.minAmount
      }
    }
    return minVale
  }

  getMaxSaOrUnitByAge(coverage) {
    let maxVale = MAX_AMOUNT
    let plan = this.state.plan
    let person = this.getPointToPerson(coverage)
    for (let amountLimit of coverage.limits.amountLimitList) {
      if (person.age >= amountLimit.minAge && person.age <= amountLimit.maxAge
        && (!amountLimit.moneyId || amountLimit.moneyId === plan.moneyId)
        && (!coverage.limits.jobIndi || !amountLimit.jobClass || amountLimit.jobClass === person.jobClass)
        && maxVale > amountLimit.maxAmount) {
        maxVale = amountLimit.maxAmount
      }
    }
    return maxVale
  }

  getMinPremium(coverage) {
    let minVale = 0
    let plan = this.state.plan
    let person = this.getPointToPerson(coverage)
    for (let permLimit of coverage.premLimitList) {
      if (person.age >= permLimit.minAge && person.age <= permLimit.maxAge
        && (!permLimit.moneyId || permLimit.moneyId === plan.moneyId)
        && minVale < permLimit.minInitialPrem) {
        minVale = permLimit.minInitialPrem
      }
    }
    return minVale
  }

  getMaxPremium(coverage) {
    let maxValue = MAX_AMOUNT
    let plan = this.state.plan
    let person = this.getPointToPerson(coverage)
    for (let permLimit of coverage.premLimitList) {
      if (person.age >= permLimit.minAge && person.age <= permLimit.maxAge
        && (!permLimit.moneyId || permLimit.moneyId === plan.moneyId)
        && maxValue > permLimit.minInitialPrem) {
        maxValue = permLimit.minInitialPrem
      }
    }
    return maxValue
  }

  calcPremium(callback) {
    let requestPlan = this.preparePlan()
    if (!requestPlan) {
      return
    }
    let calcPremiuRequest = {
      plan: requestPlan,
      msg: sessionStorage.getItem('SALES_APP_MSG'),
      sign: sessionStorage.getItem('SALES_APP_SIGN'),
      tenantCode: sessionStorage.getItem('SALES_APP_TENANT_CODE'),
    }
    this.props.actions.calcPremium(
      calcPremiuRequest,
      (error, totalFirstYearPrem, annualPrem, coveragePrems) => {
        if (error) {
          this.alert(error, 'Error')
          return
        }
        let plan = this.state.plan
        for (let coveragePrem of coveragePrems) {
          for (let mainCoverage of plan.mainCoverages) {
            if (coveragePrem.itemId == mainCoverage.itemId) {
              mainCoverage.firstYearPrem = coveragePrem.firstYearPrem
              mainCoverage.premium = coveragePrem.premium
              mainCoverage.premAn = coveragePrem.premAn
              mainCoverage.sa = coveragePrem.sa
              mainCoverage.unit = coveragePrem.unit
              continue
            }
          }
          for (let riderCoverage of plan.riderCoverages) {
            if (coveragePrem.itemId == riderCoverage.itemId) {
              riderCoverage.firstYearPrem = coveragePrem.firstYearPrem
              riderCoverage.premium = coveragePrem.premium
              riderCoverage.premAn = coveragePrem.premAn
              riderCoverage.sa = coveragePrem.sa
              riderCoverage.unit = coveragePrem.unit
              continue
            }
          }
        }
        plan.totalFirstYearPrem = totalFirstYearPrem
        plan.annualPrem = annualPrem
        console.log(plan)
        this.setState({plan}, () => {
          this.scrollPlus(200)
          callback && callback()
        })
      }
    )
  }

  isPhJobRelated() {
    let plan = this.state.plan
    for (let coverage of plan.riderCoverages) {
      if (coverage.limits.jobIndi && coverage.limits.pointToPH) {
        return true
      }
    }
    for (let i = 0; i < plan.insureds.length; i++) {
      if (this.isInsuredJobRelated(i)) {
        return true
      }
    }
    return false
  }

  isPhSmokingRelated() {
    let plan = this.state.plan
    for (let coverage of plan.riderCoverages) {
      if (coverage.limits.smokingIndi && coverage.limits.pointToPH) {
        return true
      }
    }
    for (let i = 0; i < plan.insureds.length; i++) {
      if (this.isInsuredSmokingRelated(i)) {
        return true
      }
    }
    return false
  }

  isInsuredJobRelated(index) {
    let plan = this.state.plan
    for (let coverage of [...plan.mainCoverages, ...plan.riderCoverages]) {
      if (coverage.limits.jobIndi && coverage.insuredIds.includes(index.toString())) {
        return true
      }
    }
    return false
  }

  isInsuredSmokingRelated(index) {
    let plan = this.state.plan
    for (let coverage of [...plan.mainCoverages, ...plan.riderCoverages]) {
      if (coverage.limits.smokingIndi && coverage.insuredIds.includes(index.toString())) {
        return true
      }
    }
    return false
  }

  getMinInsuredBirthday(index) {
    let minDate = moment(new Date()).subtract(MAX_AGE, 'years')
    let plan = this.state.plan
    for (let coverage of [...plan.mainCoverages, ...plan.riderCoverages]) {
      if (coverage.insuredIds.includes(index.toString())) {
        let ageRange = coverage.limits.ageRange
        if (ageRange) {
          if (ageRange.maxUnit === "1") {
            let minBirthDate = moment(new Date()).subtract(ageRange.maxAge, 'years')
            if (minDate.isBefore(minBirthDate)) {
              minDate = minBirthDate
            }
          } else if (ageRange.maxUnit === "4") {
            let minBirthDate = moment(new Date()).subtract(ageRange.maxAge, 'months')
            if (minDate.isBefore(minBirthDate)) {
              minDate = minBirthDate
            }
          } else if (ageRange.maxUnit === "5") {
            let minBirthDate = moment(new Date()).subtract(ageRange.maxAge, 'days')
            if (minDate.isBefore(minBirthDate)) {
              minDate = minBirthDate
            }
          }
        }
      }
    }
    return minDate
  }

  getMaxInsuredBirthday(index) {
    let maxDate = moment(new Date())
    let plan = this.state.plan
    for (let coverage of [...plan.mainCoverages, ...plan.riderCoverages]) {
      if (coverage.insuredIds.includes(index.toString())) {
        let ageRange = coverage.limits.ageRange
        if (ageRange) {
          if (ageRange.minUnit === "1") {
            let maxBirthDate = moment(new Date()).subtract(ageRange.minAge, 'years')
            if (maxDate.isAfter(maxBirthDate)) {
              maxDate = maxBirthDate
            }
          } else if (ageRange.minUnit === "4") {
            let maxBirthDate = moment(new Date()).subtract(ageRange.minAge, 'months')
            if (maxDate.isAfter(maxBirthDate)) {
              maxDate = maxBirthDate
            }
          } else if (ageRange.minUnit === "5") {
            let maxBirthDate = moment(new Date()).subtract(ageRange.minAge, 'days')
            if (maxDate.isAfter(maxBirthDate)) {
              maxDate = maxBirthDate
            }
          }
        }
      }
    }
    return maxDate
  }

  preparePlan() {
    let validate = true
    validate &= this.refs.proposerForm.valid()
    let insureds = this.state.plan.insureds
    for (let i = 0; i < insureds.length; i++) {
      let form = this.refs[`insuredForm_${i}`]
      if (form) {
        validate &= this.refs[`insuredForm_${i}`].valid()
      }
    }
    validate &= this.refs.mainCoverageForm.valid()
    if (!validate) {
      this.toast('Please fix all invalid fields!', 'error')
      return null
    }
    let plan = deepClone(this.state.plan)
    for (let coverage of [...plan.mainCoverages, ...plan.riderCoverages]) {
      if (['1', '3', '4', '6', '2'].includes("" + coverage.unitFlag)) {
        coverage.premium = null
      }
      if (['1', '3', '4', '7', '10'].includes("" + coverage.unitFlag)) {
        coverage.sa = null
      }
      if (coverage.limits.isUDRider) {
        coverage.paymentFreq = 4
      } else if (coverage.chargePeriod && coverage.chargePeriod.periodType === 1) {
        coverage.paymentFreq = 5
      } else {
        coverage.paymentFreq = plan.mainCoverages[0].paymentFreq
      }
    }
    let insured = plan.insureds[0]
    if (insured.laPhRela == 1) {
      insured.name = plan.proposer.name
      insured.birthday = plan.proposer.birthday
      insured.age = plan.proposer.age
      insured.gender = plan.proposer.gender
      insured.extraProperties = plan.proposer.extraProperties
      insured.smoking = plan.proposer.smoking
      insured.jobCateId = plan.proposer.jobCateId
      insured.jobCateCode = plan.proposer.jobCateCode
      let orgId = plan.proposer.id
      Object.assign(plan.proposer, insured)
      plan.proposer.id = orgId
    }
    return plan
  }

  save() {
    const quotationCode = this.props.params.quotationCode
    const isFromSavedQuotation = quotationCode && quotationCode != '0'
    if (!this.props.calcPremium && !isFromSavedQuotation) {
      this.scrollTo()
      this.toast('Please calculate premium first', 'error')
      return
    }
    this.calcPremium(() => {
      let proposal = this.state.plan
      this.props.actions.setPlan(proposal)
      this.props.actions.setProposal(proposal)
      if (this.checkLogin()) {
        proposal.producer = JSON.parse(sessionStorage.getItem("SALES_APP_PRODUCER"))
        proposal.serviceAgentCode = proposal.producer.extraProperties.agentCode || '001'
        if (proposal.producer.producerType === "2") {
          if (sessionStorage.getItem("SALES_APP_SHARE_AGENT_CODE")) {
            proposal.serviceAgentCode = sessionStorage.getItem("SALES_APP_SHARE_AGENT_CODE")
          }
          proposal.proposer.certiType = proposal.producer.certiType
          proposal.proposer.certiCode = proposal.producer.certiCode
          proposal.proposer.mobile = proposal.producer.producerPhone
          proposal.proposer.email = proposal.producer.producerEmail
        }
        for (let insured of proposal.insureds) {
          if (insured.laPhRela == 1) {
            let orgId = insured.id
            Object.assign(insured, proposal.proposer)
            insured.id = orgId
          }
        }
        this.props.actions.setPlan(proposal)
        this.props.actions.setProposal(proposal)
        if (this.props.location.query.type === 'plan') {
          this.savePlan(proposal, order => {
            this.props.actions.setPlan(order.order)
            let url = `/plan/${order.code}`
            browserHistory.push(url)
          })
        } else {
          if (proposal.proposalCode) {
            this.validateProposalStatus(proposal.proposalCode, ["31", "80", "79", "82", "91"], () => {
              this.saveOrder(proposal, order => {
                this.props.actions.setProposal(order.order)
                let url = `/proposal/${this.props.params.packageCode}/proposerInfo/${order.order.quotationCode || '0'}/${order.code}`
                browserHistory.push(url)
              })
            })
          } else {
            this.saveOrder(proposal, order => {
              this.props.actions.setProposal(order.order)
              let url = `/proposal/${this.props.params.packageCode}/proposerInfo/${order.order.quotationCode || '0'}/${order.code}`
              browserHistory.push(url)
            })
          }
        }
      }
    })
  }

  savePlan(proposal, callback) {
    let order = {
      userCode: proposal.proposer.mobile,
      introducerCode: null,
      insurerCode: proposal.salesCompanyCode,
      orderCode: proposal.quotationCode,
      order: proposal
    }
    if (proposal.producer.producerType === "1") {
      order.introducerCode = proposal.producer.producerCode
      proposal.introducerCode = order.introducerCode
    } else if (proposal.producer.producerType === "2" && sessionStorage.getItem("SALES_APP_INTRODUCER_CODE")) {
      order.introducerCode = sessionStorage.getItem("SALES_APP_INTRODUCER_CODE")
      proposal.introducerCode = order.introducerCode
    }
    this.props.actions.savePlan(order, (error, order) => {
      if (error) {
        this.alert(error, 'Error')
      } else {
        callback && callback(order)
      }
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
      introducerCode: null,
      insurerCode: proposal.salesCompanyCode,
      orderCode: proposal.proposalCode,
      order: proposal
    }
    if (proposal.producer.producerType === "1") {
      order.introducerCode = proposal.producer.producerCode
      proposal.introducerCode = order.introducerCode
    } else if (proposal.producer.producerType === "2" && sessionStorage.getItem("SALES_APP_INTRODUCER_CODE")) {
      order.introducerCode = sessionStorage.getItem("SALES_APP_INTRODUCER_CODE")
      proposal.introducerCode = order.introducerCode
    }
    this.props.actions.saveProposal(order, (error, order) => {
      if (error) {
        this.alert(error, 'Error')
      } else {
        callback && callback(order)
      }
    })
  }

  checkLogin() {
    let userString = sessionStorage.getItem("SALES_APP_PRODUCER")
    if (!userString) {
      this.confirm(null, 'Please login to continue', () => {
        sessionStorage.setItem("SALES_APP_REDIRECT_URL", 'goBack')
        browserHistory.push('/login')
      })
      return false
    } else {
      return true
    }
  }

  relationFilter(rela) {
    if (["31"].includes(this.state.plan.mainCoverages[0].limits.benefitType)) {
      return rela.value === 1 || rela.value === 7
    }
    return true
  }

  renderContent() {
    const {plan} = this.state
    const mainCoverage = plan.mainCoverages[0]
    const proposer = plan.proposer
    const insured = plan.insureds[0]
    const quotationCode = this.props.params.quotationCode
    const isFromSavedQuotation = quotationCode && quotationCode != '0'
    const isQuotation = this.props.location.query.type === 'plan'
    return (
      <div style={{paddingBottom: '70px'}}>
        <div className='d-flex p-2 align-items-center justify-content-between border-bottom'>
          <h5 className='p-2'>{plan.packageName}</h5>
          <img width='120' src={`/static/insurers/${plan.salesCompanyCode}/logo.jpg`}/>
        </div>
        <FormGroup ref="proposerForm" title="Policyholder Info" icon={<i className="fas fa-user text-primary"/>}>
          <FormInput id="proposerName" label="Name: " value={proposer.name} required={!isQuotation}
                     onChange={value => this.onProposerPropertyChange('name', value)}/>
          <FormDate id="proposerBirthday" label="Birth Date: " required value={proposer.birthday}
                    onChange={value => this.onProposerPropertyChange('birthday', formatDate(value))}
                    maxDate={moment(new Date()).subtract(MIN_PH_AGE, 'years')} readOnly={isFromSavedQuotation}/>
          <FormRadio id="proposerGender" label="Gender: " required options={GENDER_OPTIONS} required
                     value={proposer.gender} readOnly={isFromSavedQuotation}
                     onChange={value => this.onProposerPropertyChange('gender', value)}/>
          {this.isPhJobRelated() &&
          <FormSelect id="proposerJobCateCode" label="Occupation: " required blankOption="Please Select"
                      options={JOB_CATE} value={proposer.jobCateCode} readOnly={isFromSavedQuotation}
                      onChange={value => this.onProposerPropertyChange('jobCateCode', value)}/>
          }
          {this.isPhSmokingRelated() &&
          <FormRadio id="proposerSmoking" label="Smoking: " required blankOption="Please Select"
                     options={YES_NO_OPTIONS} value={proposer.smoking} readOnly={isFromSavedQuotation}
                     onChange={value => this.onProposerPropertyChange('smoking', value)}/>
          }
        </FormGroup>
        <FormGroup ref={`insuredForm_0`} title="Main Insured Info" icon={<i className="fas fa-user text-primary"/>}
                   onSubmit={e => false}>
          <FormSelect id="mainInsuredLaPhRela" label="Relation with Policyholder: " required
                      options={LA_PH_RELA_OPTIONS.filter(rela => this.relationFilter(rela))} value={insured.laPhRela}
                      blankOption="Please Select"
                      onChange={value => this.onInsuredPropertyChange(0, 'laPhRela', value)}
                      readOnly={isFromSavedQuotation}/>
          {insured.laPhRela != '1' &&
          <FormInput id="mainInsuredName" label="Name: " value={insured.name} required={!isQuotation}
                     onChange={value => this.onInsuredPropertyChange(0, 'name', value)}/>}
          {insured.laPhRela != '1' &&
          <FormDate id="mainInsuredBirthday" label="Birth Date: " required value={insured.birthday}
                    onChange={value => this.onInsuredPropertyChange(0, 'birthday', formatDate(value))}
                    minDate={this.getMinInsuredBirthday(0)} maxDate={this.getMaxInsuredBirthday(0)}
                    readOnly={isFromSavedQuotation}/>}
          {insured.laPhRela != '1' &&
          <FormRadio id="mainInsuredGender" label="Gender: " required options={GENDER_OPTIONS} value={insured.gender}
                     onChange={value => this.onInsuredPropertyChange(0, 'gender', value)}
                     readOnly={isFromSavedQuotation}/>}
          {insured.laPhRela != '1' && this.isInsuredJobRelated(0) &&
          <FormSelect id="mainInsuredJobCateCode" label="Occupation: " required blankOption="Please Select"
                      options={JOB_CATE} value={insured.jobCateCode}
                      onChange={value => this.onInsuredPropertyChange(0, 'jobCateCode', value)}
                      readOnly={isFromSavedQuotation}/>}
          {insured.laPhRela != '1' && this.isInsuredSmokingRelated(0) &&
          <FormRadio id="mainInsuredSmoking" label="Smoking: " required
                     options={YES_NO_OPTIONS} value={insured.smoking}
                     onChange={value => this.onInsuredPropertyChange(0, 'smoking', value)}
                     readOnly={isFromSavedQuotation}/>}
        </FormGroup>
        <FormGroup ref="mainCoverageForm" title="Main Benefit" icon={<i className="fas fa-tasks text-primary"/>}>
          {this.hasNoneYearPayment(this.state.plan.mainCoverages[0].limits.paymentFreqs) &&
          <FormSelect id="mainPaymentFreq" label="Payment Frequency: " required readOnly={isFromSavedQuotation}
                      value={mainCoverage.paymentFreq}
                      options={mainCoverage.limits.paymentFreqs.filter(freq => freq !== "5").map(freq =>
                        ({
                          label: paymentFreq[freq],
                          value: freq
                        })
                      )}
                      onChange={value => this.onMainCoveragePropertyChange('paymentFreq', value)}/>}
          {["31"].includes(mainCoverage.limits.benefitType) &&
          <FormDate id="inforceDate" label="Start Date: " required value={plan.inforceDate}
                    onChange={value => this.onPlanPropertyChange('inforceDate', formatDate(value))}
                    minDate={moment(new Date())} readOnly={isFromSavedQuotation}/>
          }
          <FormSelect
            id="mainChargePeriod"
            label="Charge Period: "
            required
            required
            hidden={this.getMainCoverageChargePeriodOptions().length <= 1}
            readOnly={isFromSavedQuotation}
            value={mainCoverage.chargePeriod ? mainCoverage.chargePeriod.periodType + '-' + mainCoverage.chargePeriod.periodValue : ''}
            options={this.getMainCoverageChargePeriodOptions().map(period =>
              ({
                value: period.periodType + '-' + period.periodValue,
                label: formatString(chargePeriod[period.periodType], period.periodValue),
              })
            )}
            onChange={this.onMainCoverageChargePeriodChange.bind(this)}
          />
          <FormSelect
            id="mainCoveragePeriod"
            label="Coverage Period: "
            required
            readOnly={isFromSavedQuotation}
            value={mainCoverage.coveragePeriod ? mainCoverage.coveragePeriod.periodType + '-' + mainCoverage.coveragePeriod.periodValue : ''}
            options={this.getMainCoverageCoveragePeriodOptions().map(period =>
              ({
                value: period.periodType + '-' + period.periodValue,
                label: formatString(coveragePeriod[period.periodType], period.periodValue),
              })
            )}
            onChange={this.onMainCoverageCoveragePeriodChange.bind(this)}
          />
          {mainCoverage.limits.isAnnuityProduct &&
          <FormSelect
            id="mainPayPeriod"
            label="Annuity Pay Plan: "
            required
            readOnly={isFromSavedQuotation}
            hidden={this.canHidePayPeriod()}
            value={mainCoverage.payPeriod ? mainCoverage.payPeriod.periodType + '-' + mainCoverage.payPeriod.periodValue : ''}
            options={this.getMainCoveragePayPeriodOptions().map(period =>
              ({
                value: period.periodType + '-' + period.periodValue,
                label: formatString(
                  payPeriod[period.periodType],
                  period.periodValue
                ),
              })
            )}
            onChange={this.onMainCoveragePayPeriodChange.bind(this)}
          />}
          {['3', '4'].includes("" + mainCoverage.unitFlag) &&
          <FormSelect
            id="mainBenefitlevel"
            label="Benefit Level: "
            required
            readOnly={isFromSavedQuotation}
            value={mainCoverage.benefitlevel}
            options={mainCoverage.limits.benefitLevelList.map(
              benefitlevel =>
                ({
                  value: benefitlevel.benefitLevel,
                  label: benefitlevel.levelDesc,
                })
            )}
            onChange={value =>
              this.onMainCoveragePropertyChange('benefitlevel', value)}
          />}
          {['1', '3'].includes("" + mainCoverage.unitFlag) &&
          <FormNumber
            id="mainUnit"
            label="Unit: "
            required
            readOnly={isFromSavedQuotation}
            value={mainCoverage.unit}
            min={this.getMinSaOrUnitByAge(mainCoverage)}
            max={this.getMaxSaOrUnitByAge(mainCoverage)}
            onChange={value =>
              this.onMainCoveragePropertyChange('unit', value, 'int')}
          />}
          {['0', '6'].includes("" + mainCoverage.unitFlag) &&
          <FormNumber
            id="mainSa"
            label="Sum Assured: "
            required
            readOnly={isFromSavedQuotation}
            value={this.state.plan.mainCoverages[0].sa}
            min={this.getMinSaOrUnitByAge(mainCoverage)}
            max={this.getMaxSaOrUnitByAge(mainCoverage)}
            onChange={value =>
              this.onMainCoveragePropertyChange('sa', value, 'float')}
          />}
          {['2'].includes("" + mainCoverage.unitFlag) &&
          <FormSelect
            id="mainSa"
            label="Sum Assured: "
            required
            readOnly={isFromSavedQuotation}
            value={this.state.plan.mainCoverages[0].sa}
            options={mainCoverage.limits.saList.map(sa => ({label: formatNumber(sa), value: sa}))}
            onChange={value =>
              this.onMainCoveragePropertyChange('sa', value, 'float')}
          />}
          {['0', '7', '10'].includes("" + mainCoverage.unitFlag) &&
          <FormNumber
            id="mainPremium"
            label="Premium: "
            required
            readOnly={isFromSavedQuotation}
            pattern='[0-9]*'
            value={mainCoverage.premium}
            min={this.getMinPremium(mainCoverage)}
            max={this.getMaxPremium(mainCoverage)}
            onChange={value =>
              this.onMainCoveragePropertyChange('premium', value, 'float')}
          />}
        </FormGroup>
        <FormGroup
          title={<div>Premium: <span
            className="text-success">{this.state.plan.totalFirstYearPrem && formatNumber(this.state.plan.totalFirstYearPrem)}</span>
          </div>}
          icon={<i className="far fa-credit-card text-primary"/>}
          buttons={[<button type="button" className="btn btn-primary btn-sm"
                            onClick={e => this.calcPremium()}>Calculate</button>]}>
          {(this.props.calcPremium || isFromSavedQuotation) &&
          <PremiumTabel plan={this.state.plan}/>}
        </FormGroup>
        <div className="action-footer p-1 fixed-bottom">
          <button type="button" className="btn btn-primary btn-lg btn-block mt-0" style={{height: '70px'}}
                  onClick={this.save.bind(this)}>{this.props.location.query.type === 'plan' ? 'Save' : 'Next'}
          </button>
        </div>
      </div>
    )
  }
}
