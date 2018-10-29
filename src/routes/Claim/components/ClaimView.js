import React from 'react'
import PropTypes from 'prop-types'
import './ClaimView.scss'
import browserHistory from '../../../common/history'
import { NavBar, InputItem, Icon, Steps, WingBlank, WhiteSpace, List, Picker, DatePicker, Grid, Checkbox, Card, Button, Flex } from 'antd-mobile'
import { district } from 'antd-mobile-demo-data'

const CheckboxItem = Checkbox.CheckboxItem;
const Step = Steps.Step

const steps = [
  { title: '身份验证' },
  { title: '报案信息' },
  { title: '信息确认' },
  { title: '报案完成' }
].map((s, i) => <Step key={i} title={s.title} description={s.description} />)

/**
 * 身份验证表单
 */
class AccrediationForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      pickerValue: [],
    }
  }

  render() {
    return (
      <List>
        <InputItem placeholder='请输入被保险人姓名'>
          出险人姓名
        </InputItem>
        <Picker
          title='证件类型'
          extra='请选择(可选)'
          data={district}
          value={this.state.pickerValue}
          onChange={v => this.setState({ pickerValue: v })}
          onOk={v => this.setState({ pickerValue: v })}
        >
          <List.Item>证件类型</List.Item>
        </Picker>
        <InputItem
          placeholder='请输入证件号码'
        >
          证件号码
        </InputItem>
        <Picker
          title='证件类型'
          extra='请选择(可选)'
          data={district}
          value={this.state.pickerValue}
          onChange={v => this.setState({ pickerValue: v })}
          onOk={v => this.setState({ pickerValue: v })}
        >
          <List.Item>报案人与出险人关系</List.Item>
        </Picker>
        <InputItem placeholder='请输入'>
          报案人姓名
        </InputItem>
        <InputItem placeholder='请输入'>
          报案人手机号码
        </InputItem>
        <InputItem placeholder='请输入' extra={<a href='#'>点击获取</a>}>
          手机验证码
        </InputItem>
        <List.Item>
          <div style={{ width: '100%', color: '#108ee9', textAlign: 'center' }} onClick={() => browserHistory.push('/claim/1')}>
            下一步
          </div>
        </List.Item>
      </List>
    )
  }
}

/**
 * 报案信息
 */
const nowTimeStamp = Date.now()
const now = new Date(nowTimeStamp)
const getClaimTypes = (disabled = false) => [
  { icon: <Checkbox disabled={disabled} />, text: '身故' },
  { icon: <Checkbox disabled={disabled} />, text: '重大疾病' },
  { icon: <Checkbox disabled={disabled} />, text: '高残／伤残' },
  { icon: <Checkbox disabled={disabled} />, text: '轻症' },
  { icon: <Checkbox disabled={disabled} />, text: '医疗费用' },
  { icon: <Checkbox disabled={disabled} />, text: '津贴' },
  { icon: <Checkbox disabled={disabled} />, text: '特种疾病' },
  { icon: <Checkbox disabled={disabled} />, text: '豁免' },
]
const getCareTypes = (disabled = false) => [
  { icon: <Checkbox disabled={disabled} />, text: '门诊' },
  { icon: <Checkbox disabled={disabled} />, text: '住院' },
  { icon: <Checkbox disabled={disabled} />, text: '无' },
]
class ClaimForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      date: now,
      pickerValue: [],
    }
  }

  render() {
    return (
      <List>
        <DatePicker
          mode='date'
          value={this.state.date}
          onChange={date => this.setState({ date })}
        >
          <List.Item arrow='horizontal'>事故日期</List.Item>
        </DatePicker>
        <Picker
          title='事故地点'
          extra='请选择(可选)'
          data={district}
          value={this.state.pickerValue}
          onChange={v => this.setState({ pickerValue: v })}
          onOk={v => this.setState({ pickerValue: v })}
        >
          <List.Item>事故地点</List.Item>
        </Picker>
        <InputItem placeholder='请输入事故地点详细地址'>
          详细地址
        </InputItem>
        <Picker
          title='申请理赔机构'
          extra='请选择(可选)'
          data={district}
          value={this.state.pickerValue}
          onChange={v => this.setState({ pickerValue: v })}
          onOk={v => this.setState({ pickerValue: v })}
        >
          <List.Item>申请理赔机构</List.Item>
        </Picker>
        <Picker
          title='出险原因'
          extra='请选择(可选)'
          data={district}
          value={this.state.pickerValue}
          onChange={v => this.setState({ pickerValue: v })}
          onOk={v => this.setState({ pickerValue: v })}
        >
          <List.Item>出险原因</List.Item>
        </Picker>
        <div className='sub-title'>理赔类型</div>
        <Grid data={getClaimTypes()} activeStyle={false} />
        <div className='sub-title'>治疗类型</div>
        <Grid data={getCareTypes()} activeStyle={false} />
        <List.Item>
          <Flex>
            <Flex.Item>
              <div style={{ width: '100%', color: '#108ee9', textAlign: 'center' }} onClick={() => browserHistory.push('/claim/0')}>
                上一步
              </div>
            </Flex.Item>
            <Flex.Item>
              <div style={{ width: '100%', color: '#108ee9', textAlign: 'center' }} onClick={() => browserHistory.push('/claim/2')}>
                继续
              </div>
            </Flex.Item>
          </Flex>
        </List.Item>
      </List>
    )
  }
}

/**
 * 信息确认
 */
class ConfirmationForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      date: now,
      pickerValue: [],
    }
  }

  render() {
    return (
      <List>
        <DatePicker
          disabled
          mode='date'
          value={this.state.date}
          onChange={date => this.setState({ date })}
        >
          <List.Item arrow='horizontal'>事故日期</List.Item>
        </DatePicker>
        <Picker
          disabled
          title='事故地点'
          extra='请选择(可选)'
          data={district}
          value={this.state.pickerValue}
          onChange={v => this.setState({ pickerValue: v })}
          onOk={v => this.setState({ pickerValue: v })}
        >
          <List.Item>事故地点</List.Item>
        </Picker>
        <InputItem disabled placeholder='请输入事故地点详细地址'>
          详细地址
        </InputItem>
        <Picker
          disabled
          title='申请理赔机构'
          extra='请选择(可选)'
          data={district}
          value={this.state.pickerValue}
          onChange={v => this.setState({ pickerValue: v })}
          onOk={v => this.setState({ pickerValue: v })}
        >
          <List.Item>申请理赔机构</List.Item>
        </Picker>
        <Picker
          disabled
          title='出险原因'
          extra='请选择(可选)'
          data={district}
          value={this.state.pickerValue}
          onChange={v => this.setState({ pickerValue: v })}
          onOk={v => this.setState({ pickerValue: v })}
        >
          <List.Item>出险原因</List.Item>
        </Picker>
        <div className='sub-title'>理赔类型</div>
        <Grid data={getClaimTypes(true)} activeStyle={false} />
        <div className='sub-title'>治疗类型</div>
        <Grid data={getCareTypes(true)} activeStyle={false} />
        <CheckboxItem>
          我是受益人／委托人，我已认真阅读并同意《理赔须知》相关内容，愿意承担相应的法律责任。
        </CheckboxItem>
        <List.Item>
          <Flex>
            <Flex.Item>
              <div style={{ width: '100%', color: '#108ee9', textAlign: 'center' }} onClick={() => browserHistory.push('/claim/1')}>
                上一步
              </div>
            </Flex.Item>
            <Flex.Item>
              <div style={{ width: '100%', color: '#108ee9', textAlign: 'center' }} onClick={() => browserHistory.push('/claim/3')}>
                继续
              </div>
            </Flex.Item>
          </Flex>
        </List.Item>
      </List>
    )
  }
}

/**
 * 报案完成
 */
class SuccessForm extends React.Component {
  render() {
    return (
      <Card>
        <Card.Header
          title="您的理赔报案已提交成功！"
          thumb={<Icon type="check" />}
        />
        <Card.Body>
          <div>请您尽快准备理赔申请资料，以便我公司为您办理理赔业务。</div>
        </Card.Body>
        <Card.Footer content={<div style={{ width: '100%', color: '#108ee9', textAlign: 'center' }} onClick={() => browserHistory.push('/me')}>返回</div>} />
      </Card>
    )
  }
}

/**
 * 表单容器
 */
export default class ClaimView extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { step } = this.props.routeParams
    let content
    switch (parseInt(step)) {
      case 0: content = <AccrediationForm />
        break
      case 1: content = <ClaimForm />
        break
      case 2: content = <ConfirmationForm />
        break
      case 3: content = <SuccessForm />
        break
    }
    return (
      <div style={{ height: '100%' }}>
        <NavBar mode='dark' leftContent={<Icon type='left' onClick={() => browserHistory.goBack()} />}>Claim</NavBar>
        <WingBlank mode={20} className='stepsExample'>
          <WhiteSpace />
          <Steps current={step} direction='horizontal' size='small'>{steps}</Steps>
          <WhiteSpace />
        </WingBlank>
        {content}
      </div>
    )
  }
}
