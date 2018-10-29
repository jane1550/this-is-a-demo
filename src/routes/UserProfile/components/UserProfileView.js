import React from 'react'
import PropTypes from 'prop-types'
import './UserProfileView.scss'
import browserHistory from '../../../common/history'
import {NavBar, Icon, Tabs} from 'antd-mobile'
import BaseComponent from '../../../components/BaseComponent'
import {FormDate, FormSelect, FormInput, FormRadio} from '../../../components/Forms'
import FormGroup from "../../../components/Forms/FormGroup";
import Header from "../../../components/Header";
import {formatDate} from '../../../common/utils'
import FormAction from "../../../components/Forms/FormAction";

const mockdata = [{
  fullname: 'abc',
  birthDate: '1996-05-05',
  certiCode: '410782199504025426',
  certiType: '3',
  gender: 'M',
  agentCode: '123',
  email: '10002451@qq.com',
  producerName: 'abc',
  mobile: '123456',
  agentType: '1'
}]
const GENDER_OPTIONS = [
  {value: 'M', label: 'Male'},
  {value: 'F', label: 'Female'},
]

const CERTI_TYPES = [
  {value: '1', label: 'ID Card'},
  {value: '3', label: 'Passport Number'},
  {value: '9', label: 'Other'},
]

export default class UserProfileView extends BaseComponent {
  constructor(props) {
    super(props)
    this.state = {
      user: {
        mobile: null,
        fullName: null,
        disabled: 'N',
        userType: null,
        agentCode: null,
        email: null,
        gender: null,
        certiType: null,
        certiCode: null,
        birthdate: null,
      },
      agentCode: '',
    }
    let userString = sessionStorage.getItem('SALES_APP_PRODUCER')
    if (userString) {
      const producer = JSON.parse(userString)
      this.state.user.mobile = producer.producerPhone
      this.state.user.fullName = producer.producerName
      this.state.user.gender = producer.gender
      this.state.user.userType = producer.producerType
      this.state.user.agentCode = producer.extraProperties.agentCode
      this.state.user.email = producer.producerEmail
      this.state.user.certiType = producer.certiType
      this.state.user.certiCode = producer.certiCode
      this.state.user.birthdate = producer.birthDate
    }
  }

  handleSave() {
    const reqBody = this.state.user
    console.log(reqBody)
    this.props.actions.handleSave(reqBody, (err, data) => {
      if (err) {
        this.alert(err, 'Error')
      } else {
        sessionStorage.setItem('SALES_APP_PRODUCER', JSON.stringify(data.producer))
        sessionStorage.setItem('SALES_APP_MSG', data.msg)
        sessionStorage.setItem('SALES_APP_SIGN', data.sign)
        sessionStorage.setItem('SALES_APP_TENANT_CODE', data.tenantCode)
        sessionStorage.setItem('SALES_APP_FROM_LOGIN', "true")
        this.toast('Successfully')
        setTimeout(() => {
          browserHistory.goBack()
        }, 500)
      }
    })
  }

  onUserPropertyChange(property, value) {
    let user = this.state.user
    user[property] = value
    this.setState({user})
  }

  agentValidate() {
    if (!this.state.agentCode) {
      return
    }
    const reqBody = {agentCode: this.state.agentCode}
    this.props.actions.verifyAgent(reqBody, (err, data) => {
      this.closeModal()
      if (err) {
        this.alert(err, 'Error')
      } else {
        sessionStorage.setItem('SALES_APP_PRODUCER', JSON.stringify(data.producer))
        sessionStorage.setItem('SALES_APP_MSG', data.msg)
        sessionStorage.setItem('SALES_APP_SIGN', data.sign)
        sessionStorage.setItem('SALES_APP_TENANT_CODE', data.tenantCode)
        sessionStorage.setItem('SALES_APP_FROM_LOGIN', "true")
        this.toast('Successfully')
        setTimeout(() => {
          location.reload()
        }, 500)
      }
    })
  }

  openAgentVerify() {
    this.openModal(<FormGroup onSubmit={e => e.preventDefault()}>
      <FormInput label="Please input agent code which your mobile is bind to" colSize="full" inline={false} required
                 value={this.state.agentCode} onChange={agentCode => this.setState({agentCode})}/>
      <FormAction>
        <button type="button" className="btn btn-primary m-1"
                onClick={this.agentValidate.bind(this)}>Validate
        </button>
      </FormAction>
    </FormGroup>, 'Agent Verify')
  }

  renderHeader() {
    return (
      <Header title="My Profile"/>
    )
  }

  renderContent() {
    return (
      <div>
        <FormGroup>
          <FormInput value={this.state.user.mobile} label='Mobile: ' disabled/>
          <FormSelect value={this.state.user.userType} label='User Type: '
                      options={[{label: 'Agent', value: '1'}, {label: 'Customer', value: '2'}]} disabled/>
          <FormInput value={this.state.user.agentCode} label='Agent Code: ' disabled
                     hidden={this.state.user.userType !== '1'}/>
          <FormInput value={this.state.user.fullName} label='Full Name: '
                     onChange={val => this.onUserPropertyChange('fullName', val)}/>
          <FormRadio value={this.state.user.gender} label='Gender: ' options={GENDER_OPTIONS}
                     onChange={val => this.onUserPropertyChange('gender', val)}/>
          <FormDate value={this.state.user.birthdate} label='Birth Date: ' minDate='1970-01-01' maxDate='2018-04-30'
                    onChange={value => this.onUserPropertyChange('birthdate', formatDate(value))}/>
          <FormSelect value={this.state.user.certiType} onChange={val => this.onUserPropertyChange('certiType', val)}
                      label='ID Type: ' options={CERTI_TYPES} colSize='large' blankOption='Please Select'/>
          <FormInput value={this.state.user.certiCode} label='ID Number: '
                     onChange={val => this.onUserPropertyChange('certiCode', val)}/>
          <FormInput value={this.state.user.email} label='Email: '
                     onChange={val => this.onUserPropertyChange('email', val)}/>
        </FormGroup>
        {this.state.user.userType !== "1" &&
        <div className="text-center p-2 d-flex justify-content-around">
          <button className="btn btn-success col-6 col-md-4" onClick={this.openAgentVerify.bind(this)}>
            <i className="fas fa-level-up-alt"/>
            <span className="ml-2">Upgrade to Agent</span>
          </button>
        </div>
        }
      </div>
    )
  }

  renderFooter() {
    return (
      <div className="action-footer p-1">
        <button type="button" className="btn btn-secondary btn-lg btn-block mt-0" style={{height: '70px'}}
                onClick={e => browserHistory.goBack()}>Cancel
        </button>
        <button type="button" className="btn btn-primary btn-lg btn-block mt-0" style={{height: '70px'}}
                onClick={this.handleSave.bind(this)}>Save
        </button>
      </div>
    )
  }
}
