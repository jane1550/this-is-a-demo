import React from 'react'
import PropTypes from 'prop-types'
import './CSView.scss'
import browserHistory from '../../../common/history'
import { NavBar, Result, InputItem, Icon, Switch, WingBlank, WhiteSpace, List, Picker, DatePicker, Grid, Checkbox, Card, Button, Flex } from 'antd-mobile'
import { district } from 'antd-mobile-demo-data'

const mockPolicy = {
  policyNo: 2180000000548,
  productName: "北京人寿意外伤害保险A款",
  effectiveDate: "2016-11-11",
  clientName: "张小北",
  idType: "身份证",
  idNo: "112323321231231233",
  bankName: "中国工商银行",
  bankAccount: "********66126",
}

const titles = {
  BASICS: '投保人基本资料变更',
  CONTACT: '投保人联系方式变更',
  PAYMENT: '投保人缴费方式变更',
  FREELOOK: '退保'
}

class BasicsForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      pickerValue: [],
      checked: false,
    }
  }

  render() {
    return (
      <div className="basics-form">
        <NavBar mode='dark' leftContent={<Icon type='left' onClick={() => browserHistory.goBack()} />}>{titles.BASICS}</NavBar>
        <WingBlank size="lg">
          <WhiteSpace size="lg" />
          <Card>
            <Card.Header
              title={`保单号    ${mockPolicy.policyNo}`}
            />
            <Card.Body>
              <div>{mockPolicy.productName}</div>
            </Card.Body>
            <Card.Footer content={
              <div className="card-footer-fileds">
                <div>生效日期：{mockPolicy.effectiveDate}</div>
                <div>客户姓名：{mockPolicy.clientName}</div>
                <div>证件类型：{mockPolicy.idType}</div>
                <div>证件号码：{mockPolicy.idNo}</div>
              </div>
            } />
          </Card>
          <WhiteSpace size="lg" />
        </WingBlank>
        <Card>
          <Card.Header title="您可以对以下信息进行变更" />
          <Card.Body>
            <List>
              <Picker
                title='婚姻状态'
                extra='请选择(可选)'
                data={district}
                value={this.state.pickerValue}
                onChange={v => this.setState({ pickerValue: v })}
                onOk={v => this.setState({ pickerValue: v })}
              >
                <List.Item>婚姻状态</List.Item>
              </Picker>
              <Picker
                title='国籍'
                extra='请选择(可选)'
                data={district}
                value={this.state.pickerValue}
                onChange={v => this.setState({ pickerValue: v })}
                onOk={v => this.setState({ pickerValue: v })}
              >
                <List.Item>国籍</List.Item>
              </Picker>
              <List.Item extra={<Switch checked={this.state.checked} onClick={(checked) => this.setState({ checked })} />}>是否为长期</List.Item>
              <Picker
                title='学历'
                extra='请选择(可选)'
                data={district}
                value={this.state.pickerValue}
                onChange={v => this.setState({ pickerValue: v })}
                onOk={v => this.setState({ pickerValue: v })}
              >
                <List.Item>学历</List.Item>
              </Picker>
              <InputItem placeholder='请输入'>年收入</InputItem>
              <Picker
                title='主要收入来源'
                extra='请选择(可选)'
                data={district}
                value={this.state.pickerValue}
                onChange={v => this.setState({ pickerValue: v })}
                onOk={v => this.setState({ pickerValue: v })}
              >
                <List.Item>主要收入来源</List.Item>
              </Picker>
              <InputItem placeholder='请输入' extra="CM">身高</InputItem>
              <InputItem placeholder='请输入' extra="KG">体重</InputItem>
              <List.Item>
                <div style={{ width: '100%', color: '#108ee9', textAlign: 'center' }} onClick={() => browserHistory.push(`/cs/${this.props.way}/1`)}>
                  提交
              </div>
              </List.Item>
            </List>
          </Card.Body>
        </Card>
      </div>
    )
  }
}

class ContactForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      pickerValue: [],
      checked: false,
    }
  }

  render() {
    return (
      <div className="contact-form">
        <NavBar mode='dark' leftContent={<Icon type='left' onClick={() => browserHistory.goBack()} />}>{titles.CONTACT}</NavBar>
        <WingBlank size="lg">
          <WhiteSpace size="lg" />
          <Card>
            <Card.Header
              title={`保单号    ${mockPolicy.policyNo}`}
            />
            <Card.Body>
              <div>{mockPolicy.productName}</div>
            </Card.Body>
            <Card.Footer content={
              <div className="card-footer-fileds">
                <div>生效日期：{mockPolicy.effectiveDate}</div>
                <div>客户姓名：{mockPolicy.clientName}</div>
                <div>证件类型：{mockPolicy.idType}</div>
                <div>证件号码：{mockPolicy.idNo}</div>
              </div>
            } />
          </Card>
          <WhiteSpace size="lg" />
        </WingBlank>
        <Card>
          <Card.Header title="您可以对以下信息进行变更" />
          <Card.Body>
            <List>
              <Picker
                title='所在省市区'
                extra='请选择(可选)'
                data={district}
                value={this.state.pickerValue}
                onChange={v => this.setState({ pickerValue: v })}
                onOk={v => this.setState({ pickerValue: v })}
              >
                <List.Item>所在省市区</List.Item>
              </Picker>
              <InputItem placeholder='请输入'>联系地址</InputItem>
              <InputItem placeholder='请输入'>电子邮箱</InputItem>
              <InputItem placeholder='请输入'>邮编</InputItem>
              <InputItem placeholder='请输入'>固定电话</InputItem>
              <InputItem placeholder='请输入'>移动电话</InputItem>
              <InputItem placeholder='请输入'>首选回访电话</InputItem>
              <List.Item>
                <div style={{ width: '100%', color: '#108ee9', textAlign: 'center' }} onClick={() => browserHistory.push(`/cs/${this.props.way}/1`)}>
                  提交
              </div>
              </List.Item>
            </List>
          </Card.Body>
        </Card>
      </div>
    )
  }
}

class PaymentForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      pickerValue: [],
      checked: false,
    }
  }

  render() {
    return (
      <div className="payment-form">
        <NavBar mode='dark' leftContent={<Icon type='left' onClick={() => browserHistory.goBack()} />}>{titles.PAYMENT}</NavBar>
        <WingBlank size="lg">
          <WhiteSpace size="lg" />
          <Card>
            <Card.Header
              title={`保单号    ${mockPolicy.policyNo}`}
            />
            <Card.Body>
              <div>{mockPolicy.productName}</div>
            </Card.Body>
            <Card.Footer content={
              <div className="card-footer-fileds">
                <div>生效日期：{mockPolicy.effectiveDate}</div>
                <div>客户姓名：{mockPolicy.clientName}</div>
                <div>证件类型：{mockPolicy.idType}</div>
                <div>证件号码：{mockPolicy.idNo}</div>
              </div>
            } />
          </Card>
          <WhiteSpace size="lg" />
        </WingBlank>
        <Card>
          <Card.Header title="您可以对以下信息进行变更" />
          <Card.Body>
            <Card>
              <Card.Header
                thumb={<Icon type="check" />}
                title={`保单号    ${mockPolicy.policyNo}`}
              />
              <Card.Body>
                <div>{mockPolicy.productName}</div>
              </Card.Body>
              <Card.Footer content={
                <div className="card-footer-fileds">
                  <div>生效日期：{mockPolicy.effectiveDate}</div>
                  <div>客户姓名：{mockPolicy.clientName}</div>
                  <div>证件类型：{mockPolicy.idType}</div>
                  <div>证件号码：{mockPolicy.idNo}</div>
                </div>
              } />
            </Card>
            <WhiteSpace size="lg" />
            <Card>
              <Card.Header
                thumb={<Icon type="check" />}
                title={`保单号    ${mockPolicy.policyNo}`}
              />
              <Card.Body>
                <div>{mockPolicy.productName}</div>
              </Card.Body>
              <Card.Footer content={
                <div className="card-footer-fileds">
                  <div>生效日期：{mockPolicy.effectiveDate}</div>
                  <div>客户姓名：{mockPolicy.clientName}</div>
                  <div>证件类型：{mockPolicy.idType}</div>
                  <div>证件号码：{mockPolicy.idNo}</div>
                </div>
              } />
            </Card>
          </Card.Body>
        </Card>
        <List>
          <Card>
            <Card.Body>
              <div>原缴费账号</div>
            </Card.Body>
            <Card.Footer content={
              <div className="card-footer-fileds">
                <div>{mockPolicy.bankName}</div>
              </div>
            } extra={mockPolicy.bankAccount} />
          </Card>
          <Card>
            <Card.Body>
              <div>变更后缴费账号</div>
            </Card.Body>
            <Card.Footer content={
              <div className="card-footer-fileds">
                <div>账户名</div>
              </div>
            } extra={mockPolicy.clientName} />
          </Card>
          <Picker
            title='开户银行'
            extra='请选择(可选)'
            data={district}
            value={this.state.pickerValue}
            onChange={v => this.setState({ pickerValue: v })}
            onOk={v => this.setState({ pickerValue: v })}
          >
            <List.Item>开户银行</List.Item>
          </Picker>
          <InputItem placeholder='请输入'>银行卡号</InputItem>
          <InputItem placeholder='请输入'>确认卡号</InputItem>
          <List.Item>
            <div style={{ width: '100%', color: '#108ee9', textAlign: 'center' }} onClick={() => browserHistory.push(`/cs/${this.props.way}/1`)}>
              提交
            </div>
          </List.Item>
        </List>
      </div>
    )
  }
}

class FreelookForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      pickerValue: [],
      checked: false,
    }
  }

  render() {
    return (
      <div className="freelook-form">
        <NavBar mode='dark' leftContent={<Icon type='left' onClick={() => browserHistory.goBack()} />}>{titles.FREELOOK}</NavBar>
        <Card>
          <Card.Header title="友情提示：" thumb={<Icon type="cross-circle" />} />
          <Card.Body>
            <div>1、退保后，我司将不承认任何保险责任；</div>
            <div>2、退保金额将于5个工作日内到账，请耐心查收；</div>
          </Card.Body>
        </Card>
        <Card>
          <Card.Header
            thumb={<Icon type="right" />}
            title="保单信息"
          />
          <Card.Body>
            <div>{`保单号    ${mockPolicy.policyNo}`}</div>
            <div>{mockPolicy.productName}</div>
          </Card.Body>
          <Card.Footer content={
            <div className="card-footer-fileds">
              <div>生效日期：{mockPolicy.effectiveDate}</div>
              <div>客户姓名：{mockPolicy.clientName}</div>
              <div>证件类型：{mockPolicy.idType}</div>
              <div>证件号码：{mockPolicy.idNo}</div>
            </div>
          } />
        </Card>
        <Card>
          <Card.Header
            thumb={<Icon type="right" />}
            title="退费信息"
          />
          <Card.Body>
            <List>
              <List.Item>退保金额&emsp;3000元</List.Item>
              <Picker
                title='退保原因'
                extra='请选择(可选)'
                data={district}
                value={this.state.pickerValue}
                onChange={v => this.setState({ pickerValue: v })}
                onOk={v => this.setState({ pickerValue: v })}
              >
                <List.Item>退保原因</List.Item>
              </Picker>
            </List>
          </Card.Body>
        </Card>
        <Card>
          <Card.Header
            thumb={<Icon type="right" />}
            title="账户信息"
          />
          <Card.Body>
            <List>
              <List.Item>账户名称&emsp;{mockPolicy.clientName}</List.Item>
              <List.Item>转账银行&emsp;{mockPolicy.bankName}</List.Item>
              <List.Item>银行账号&emsp;{mockPolicy.bankAccount}</List.Item>
              <List.Item>
                <div style={{ width: '100%', color: '#108ee9', textAlign: 'center' }} onClick={() => browserHistory.push(`/cs/${this.props.way}/1`)}>
                  提交
                </div>
              </List.Item>
            </List>
          </Card.Body>
        </Card>
      </div>
    )
  }
}

class SuccessPage extends React.Component {
  render() {
    let title
    switch (this.props.way) {
      case 0: title = titles.BASICS
        break
      case 1: title = titles.CONTACT
        break
      case 2: title = titles.PAYMENT
        break
      case 3: title = titles.FREELOOK
        break
    }
    return (
      <div className="basics-form">
        <NavBar mode='dark'>{title}</NavBar>
        <List>
          <Result
            img={<Icon type="check" />}
            title="提交成功"
            message={
              <div>
                如果有疑问，您可以通过在线客服<br />
                或拨打****进行咨询
              </div>
            }
          />
          <List.Item>
            <div style={{ width: '100%', color: '#108ee9', textAlign: 'center' }} onClick={() => browserHistory.push('/me')}>
              返回
            </div>
          </List.Item>
        </List>
      </div>
    )
  }
}

/**
 * 0 - 基本资料变更
 * 1 - 联系方式变更
 * 2 - 缴费方式变更
 * 3 - 犹豫期撤保
 */

export default class CSView extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    let content
    if (parseInt(this.props.routeParams.step) === 0) {
      switch (parseInt(this.props.routeParams.way)) {
        case 0: content = <BasicsForm way={parseInt(this.props.routeParams.way)} />
          break
        case 1: content = <ContactForm way={parseInt(this.props.routeParams.way)} />
          break
        case 2: content = <PaymentForm way={parseInt(this.props.routeParams.way)} />
          break
        case 3: content = <FreelookForm way={parseInt(this.props.routeParams.way)} />
          break
      }
    }
    if (parseInt(this.props.routeParams.step) === 1) {
      content = <SuccessPage way={parseInt(this.props.routeParams.way)} />
    }
    return (
      <div style={{ height: '100%' }}>
        {content}
      </div>
    )
  }
}
