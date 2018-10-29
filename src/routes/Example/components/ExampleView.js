import React from 'react'
import BaseComponent from '../../../components/BaseComponent'
import './ExampleView.scss'
import ChinaCities from './ChinaCities'
import {
  FormGroup,
  FormField,
  FormInput,
  FormText,
  FormNumber,
  FormSelect,
  FormDate,
  FormTextarea,
  FormRadio,
  FormFile,
  FormCheckbox,
  FormCascadeSelect,
  FormToggle,
  FormAction
} from '../../../components/Forms'
import {SideMenu, SideMenuItem} from '../../../components/Menu'
import {NavTab, NavPill} from '../../../components/Navs'
import Navbar from '../../../components/Navbar'
import SearchBar from '../../../components/SearchBar'
import Stepper from 'react-stepper-horizontal'
import Header from '../../../components/Header'
import {t, lang} from '../../../common/utils'
import {
  ResponsiveContainer, ComposedChart, Line, Bar, Area, Scatter, XAxis,
  YAxis, ReferenceLine, ReferenceDot, Tooltip, Legend, CartesianGrid, Brush,
  LineChart
} from 'recharts'
import Signature from '../../../components/Signature'

const data = [
  {name: 'Page A', uv: 590, pv: 800, amt: 1400},
  {name: 'Page B', uv: 868, pv: 967, amt: 1506},
  {name: 'Page C', uv: 1397, pv: 1098, amt: 989},
  {name: 'Page D', uv: 1480, pv: 1200, amt: 1228},
  {name: 'Page E', uv: 1520, pv: 1108, amt: 1100},
  {name: 'Page F', uv: 1400, pv: 680, amt: 1700},
]

export default class HomeView extends BaseComponent {
  constructor(props) {
    super(props)
    this.state = {
      toggleActive: true,
      maskValue: '(021)5678-9012',
      unmaskValue: '123456789012',
      text: '',
    }
  }

  componentWillMount() {
    if (this.props.location.query.lang) {
      lang(this.props.location.query.lang)
      this.setState({})
    }
  }

  onToggle() {
    this.setState({toggleActive: !this.state.toggleActive});
  }

  renderHeader() {
    return (
      <Navbar theme="dark" bgColor="primary"
              brand={<img src={require('../../../assets/eBao.png')} onClick={()=>this.toggleLeftMenu()}/>}>
        <ul className="navbar-nav">
          <li className="nav-item active dropdown">
            <a className="nav-link dropdown-toggle" id="navbarDropdownMenuLink" data-toggle="dropdown"
               aria-haspopup="true" aria-expanded="false">
              Home
            </a>
            <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
              <a className="dropdown-item">Action</a>
              <a className="dropdown-item">Another action</a>
              <a className="dropdown-item">Something else here</a>
            </div>
          </li>
          <li className="nav-item">
            <a className="nav-link">Features</a>
          </li>
          <li className="nav-item">
            <a className="nav-link">Pricing</a>
          </li>
        </ul>
        <form className="form-inline" onSubmit={e=>e.preventDefault()}>
          <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search"/>
          <button className="btn btn-outline-success my-2 my-sm-0" onClick={()=>this.toggleRightMenu()}><i
            className="fas fa-bars"/></button>
        </form>
      </Navbar>
      // <Header title={t("Example")}
      //         leftComponent={<i className="fas fa-bars text-primary" onClick={()=>this.toggleLeftMenu()}/>}
      //         rightComponent={<i className="fas fa-bars text-primary" onClick={()=>this.toggleRightMenu()}/>}/>
    )
  }

  renderFooter() {
    return (
      <button type="button" className="btn btn-primary btn-lg btn-block mt-0"
              style={{height: '70px'}}>{t("Next")}</button>
    )
  }

  renderLeftMenu() {
    return (
      <SideMenu>
        <SideMenuItem bgColor="dark" title={<span className="text-white">Main Menu1</span>}
                      icon={<i className="fas fa-tachometer-alt text-white"/>} defaultOpen>
          <SideMenuItem indent={1} title={<span>Sub Menu1</span>}
                        icon={<i className="fas fa-tachometer-alt"/>} disabled/>
          <SideMenuItem indent={1} title={<span>Sub Menu1</span>}
                        icon={<i className="fas fa-tachometer-alt"/>}/>
        </SideMenuItem>
        <SideMenuItem bgColor="dark" title={<span className="text-white">Main Menu2</span>}
                      icon={<i className="fas fa-tachometer-alt text-white"/>}/>
        <SideMenuItem defaultOpen={true} bgColor="dark" title={<span className="text-white">Main Menu3</span>}
                      icon={<i className="fas fa-tachometer-alt text-white"/>}>
          <SideMenuItem bgColor="dark" indent={1} title={<span className="text-white">Sub Menu1</span>}
                        icon={<i className="fas fa-tachometer-alt text-white"/>}/>
          <SideMenuItem bgColor="dark" indent={1} title={<span className="text-white">Sub Menu2</span>}
                        icon={<i className="fas fa-tachometer-alt text-white"/>}/>
          <SideMenuItem bgColor="dark" indent={1} title={<span className="text-white">Sub Menu3</span>}
                        icon={<i className="fas fa-tachometer-alt text-white"/>}>
            <SideMenuItem bgColor="dark" indent={2} title={<span className="text-white">Sub Sub Menu1</span>}
                          icon={<i className="fas fa-tachometer-alt text-white"/>}/>
            <SideMenuItem bgColor="dark" indent={2} title={<span className="text-white">Sub Sub Menu2</span>}
                          icon={<i className="fas fa-tachometer-alt text-white"/>}/>
            <SideMenuItem bgColor="dark" indent={2} title={<span className="text-white">Sub Sub Menu3</span>}
                          icon={<i className="fas fa-tachometer-alt text-white"/>}/>
          </SideMenuItem>
        </SideMenuItem>
        <SideMenuItem title={<span>Main Menu4</span>}
                      icon={<i className="fas fa-tachometer-alt"/>} active/>
        <SideMenuItem title={<span>Sub Menu5 long long long long long title</span>}
                      icon={<i className="fas fa-tachometer-alt"/>} defaultOpen disabled>
          <SideMenuItem indent={1} title={<span>Sub Menu1</span>}
                        icon={<i className="fas fa-tachometer-alt"/>}/>
        </SideMenuItem>
      </SideMenu>
    )
  }

  renderRightMenu() {
    return (
      <SideMenu>
        <SideMenuItem align="right" bgColor="dark" title={<span className="text-white">Main Menu1</span>}
                      icon={<i className="fas fa-tachometer-alt text-white"/>} defaultOpen>
          <SideMenuItem align="right" indent={1} title={<span>Sub Menu1</span>}
                        icon={<i className="fas fa-tachometer-alt"/>} disabled/>
          <SideMenuItem align="right" indent={1} title={<span>Sub Menu1</span>}
                        icon={<i className="fas fa-tachometer-alt"/>}/>
        </SideMenuItem>
        <SideMenuItem align="right" bgColor="dark" title={<span className="text-white">Main Menu2</span>}
                      icon={<i className="fas fa-tachometer-alt text-white"/>}/>
        <SideMenuItem align="right" defaultOpen={true} bgColor="dark"
                      title={<span className="text-white">Main Menu3</span>}
                      icon={<i className="fas fa-tachometer-alt text-white"/>}>
          <SideMenuItem align="right" bgColor="dark" indent={1} title={<span className="text-white">Sub Menu1</span>}
                        icon={<i className="fas fa-tachometer-alt text-white"/>}/>
          <SideMenuItem align="right" bgColor="dark" indent={1} title={<span className="text-white">Sub Menu2</span>}
                        icon={<i className="fas fa-tachometer-alt text-white"/>}/>
          <SideMenuItem align="right" bgColor="dark" indent={1} title={<span className="text-white">Sub Menu3</span>}
                        icon={<i className="fas fa-tachometer-alt text-white"/>}>
            <SideMenuItem align="right" bgColor="dark" indent={2}
                          title={<span className="text-white">Sub Sub Menu1</span>}
                          icon={<i className="fas fa-tachometer-alt text-white"/>}/>
            <SideMenuItem align="right" bgColor="dark" indent={2}
                          title={<span className="text-white">Sub Sub Menu2</span>}
                          icon={<i className="fas fa-tachometer-alt text-white"/>}/>
            <SideMenuItem align="right" bgColor="dark" indent={2}
                          title={<span className="text-white">Sub Sub Menu3</span>}
                          icon={<i className="fas fa-tachometer-alt text-white"/>}/>
          </SideMenuItem>
        </SideMenuItem>
        <SideMenuItem align="right" title={<span>Main Menu4</span>}
                      icon={<i className="fas fa-tachometer-alt"/>} active/>
        <SideMenuItem align="right" title={<span>Sub Menu5</span>}
                      icon={<i className="fas fa-tachometer-alt"/>} defaultOpen disabled>
          <SideMenuItem align="right" indent={1} title={<span>Sub Menu1</span>}
                        icon={<i className="fas fa-tachometer-alt"/>}/>
        </SideMenuItem>
      </SideMenu>
    )
  }

  getDefaultLeftMenuOpen() {
    return window.innerWidth > 768
  }

  renderContent() {
    return (
      <div>
        <Stepper steps={ [{title: 'Step One'}, {title: 'Step Two'}, {title: 'Step Three'}, {title: 'Step Four'}] }
                 activeStep={0}/>
        <SearchBar onSearch={value=>this.alert('Search Text: ' + value)}/>
        <FormGroup ref="form1" title="Test form group1" icon={<i className="fas fa-user text-primary" />}
                   buttons={[<button type="button" className="btn btn-primary btn-sm">Custom Button</button>]}
                   onSubmit={e=>false}>
          <FormInput label="Long long long title text input with suggest list and custom validation"
                     value={this.state.text} suggestList={['abcdef','ghijkl','mnopqr']} required
                     invalid={(this.state.text && this.state.text.length < 6) || this.state.unmaskValue.length < 12}
                     invalidFeedback="Length should no less than 6, and please finish unmask value to 999999999999"
                     tooltip="<em>Tooltip</em> <u>with</u> <b>HTML</b>" onChange={text=>this.setState({text})}/>
          <FormInput label="Input with display mask #:(3,7)" mask="#:(3,7)" value="123456789"/>
          <FormInput label="Input mask (999) 9999-9999" inputMask="(999) 9999-9999" value={this.state.maskValue}
                     onChange={maskValue=>this.setState({maskValue})}/>
          <FormInput label="Input mask 9999-9999-9999 and real value unmask to 999999999999"
                     inputMask="9999-9999-9999" value={this.state.unmaskValue}
                     onChange={unmaskValue=>this.setState({unmaskValue})} valueUnmask={true}/>
          <FormText label="Text: " required>
            my long long long static text
          </FormText>
          <FormNumber label="Number colSize large: " required prefix="$" postfix=".00"
                      colSize="large"/>
          <FormSelect label="Select colSize large: " options={[{label: 'My option', value: '0'}, '1']} required
                      colSize="large"
                      blankOption="Please select"/>
          <FormDate label="Date:" required minDate="1970-01-01" maxDate="2018-04-30"/>
          <FormTextarea label="Textarea force not inline: " required inline={false}/>
          <FormRadio label="Radio: " options={[{label: 'Male', value: 0},1,2,3,4,5,6,7,8,9]} required/>
          <FormCheckbox label="Checkbox: " options={[{label: 'Male', value: 0},1,2,3,4,5,6,7,8,9]} required/>
          <FormFile label="File: " required lang={lang()}/>
          <FormCascadeSelect label="CascadeSelect:" required level={3} options={ChinaCities}
                             blankOptions={['请选择省', '请选择市', '请选择区']} colSize="full"
                             align={window.innerWidth>=768? "horizontal":"vertical"}/>
          <FormToggle label="Toggle: " required description="Are you OK?" value={this.state.toggleActive}
                      onChange={active=>this.setState({toggleActive:active})}
                      colSize="full"/>
          <FormAction>
            <button type="button" className="btn btn-primary m-1"
                    onClick={e=>this.alert('Mask Value: ' + this.state.maskValue + '; unmask Value: ' + this.state.unmaskValue, 'Warning')}>
              Alert
            </button>
            <button type="button" className="btn btn-primary m-1"
                    onClick={e=>this.confirm('Toggle language', 'Are you sure to', ()=>{lang(lang()==="zh-CN"? 'en':'zh-CN'); this.setState({})})}>
              Confirm
            </button>
            <button type="button" className="btn btn-primary m-1" onClick={e=>this.toast('Failed!', 'error')}>Toast
            </button>
            <button type="button" className="btn btn-primary m-1"
                    onClick={e=>this.openModal(<div><div>Custom Modal Content Here</div><button className="btn btn-primary" onClick={()=>this.closeModal()}>Do Something and Close</button></div>, 'Optional Title')}>
              Open Modal
            </button>
            <button type="submit" className="btn btn-primary m-1"
                    onClick={e=>this.alert('Valid: ' + this.refs.form1.valid(), 'Error')}>Validate
            </button>
          </FormAction>
        </FormGroup>
        <div className="row m-0">
          <div className="col-12 col-md-6 p-1">
            <FormGroup ref="form2">
              <FormInput label="Long long long title text input with suggest list" required
                         suggestList={['a','b','c']} inline={window.innerWidth<768}/>
              <FormText label="Text: " required inline={window.innerWidth<768}>
                my long long long static text
              </FormText>
              <FormNumber label="Number: " required prefix="$" postfix=".00" inline={window.innerWidth<768}/>
              <FormSelect label="Select: " options={[{label: 'My option', value: '0'}, '1']} required
                          blankOption="Please select" inline={window.innerWidth<768}/>
              <FormDate label="Date:" required minDate="1970-01-01" maxDate="2018-04-30" timeFormat={true}
                        inline={window.innerWidth<768}/>
              <FormTextarea label="Textarea: " required inline={window.innerWidth<768}/>
              <FormRadio label="Radio: " options={[{label: 'Male', value: 0},1,2]} align="vertical" required
                         inline={window.innerWidth<768}/>
              <FormCheckbox label="Checkbox: " options={[{label: 'Male', value: 0},1,2]} required align="vertical"
                            inline={window.innerWidth<768}/>
              <FormFile label="File: " required lang={lang()} inline={window.innerWidth<768}/>
              <FormCascadeSelect label="CascadeSelect:" required level={3} options={ChinaCities}
                                 blankOptions={['请选择省', '请选择市', '请选择区']} inline={window.innerWidth<768}/>
              <FormToggle label="Toggle: " required description="Are you OK?" value={this.state.toggleActive}
                          colSize="full" inline={window.innerWidth<768}/>
              <FormAction>
                <button type="button" className="btn btn-primary m-1" onClick={e=>this.alert('Test alert', 'Warning')}>
                  Alert
                </button>
                <button type="button" className="btn btn-primary m-1"
                        onClick={e=>this.confirm('Toggle', 'Are you sure to', ()=>this.setState({toggleActive: !this.state.toggleActive}))}>
                  Confirm
                </button>
                <button type="button" className="btn btn-primary m-1" onClick={e=>this.toast('Failed!', 'error')}>Toast
                </button>
                <button type="button" className="btn btn-primary m-1"
                        onClick={e=>this.openModal(<div><div>Custom Modal Content Here</div><button className="btn btn-primary" onClick={()=>this.closeModal()}>Do Something and Close</button></div>, 'Optional Title')}>
                  Open Modal
                </button>
                <button type="submit" className="btn btn-primary m-1"
                        onClick={e=>this.alert('Valid: ' + this.refs.form2.valid(), 'Error')}>Validate
                </button>
              </FormAction>
            </FormGroup>
          </div>
          <div className="col-12 col-md-6 p-1">
            <FormGroup ref="form3" title="Test viewMode form fields" icon={<i className="fas fa-user text-primary" />}
                       buttons={[<button type="button" className="btn btn-primary btn-sm">Custom Button</button>]}
                       onSubmit={e=>false}>
              <FormInput label="Long long long title text input with suggest list" required
                         suggestList={['a','b','c']} viewMode value="static text mode" inline={window.innerWidth<768}/>
              <FormText label="Text: " required value="value instead of children" inline={window.innerWidth<768}>
                my long long long static text
              </FormText>
              <FormNumber label="Number: " required prefix="$" postfix=".00" value={10000} viewMode
                          inline={window.innerWidth<768}/>
              <FormSelect label="Select: " options={[{label: 'My option', value: '0'}, '1']} required
                          blankOption="Please select" viewMode value="0" inline={window.innerWidth<768}/>
              <FormDate label="Date:" required minDate="1970-01-01" maxDate="2018-04-30" viewMode value="2018-04-11"
                        timeFormat={"HH:mm"} inline={window.innerWidth<768}/>
              <FormTextarea label="Textarea: " required value="static    textarea text with blank" viewMode
                            inline={window.innerWidth<768}/>
              <FormRadio label="Radio: " options={[{label: 'Male', value: 0},1,2,3,4,5,6,7,8,9]} value="0" required
                         viewMode inline={window.innerWidth<768}/>
              <FormCheckbox label="Checkbox: " options={[{label: 'Male', value: 0},1,2,3,4,5,6,7,8,9]} required
                            value={[0,1]} viewMode inline={window.innerWidth<768}/>
              <FormFile label="File: " required viewMode lang={lang()} inline={window.innerWidth<768}/>
              <FormCascadeSelect label="CascadeSelect:" required level={3} options={ChinaCities}
                                 value={['110000',"110100","110105"]}
                                 blankOptions={['请选择省', '请选择市', '请选择区']} viewMode inline={window.innerWidth<768}/>
              <FormToggle label="Toggle: " required description="Are you OK?" value={this.state.toggleActive}
                          colSize="full" viewMode inline={window.innerWidth<768}/>
              <FormAction>
                <button type="button" className="btn btn-primary m-1" onClick={e=>this.alert('Test alert', 'Warning')}>
                  Alert
                </button>
                <button type="button" className="btn btn-primary m-1"
                        onClick={e=>this.confirm('Toggle', 'Are you sure to', ()=>this.setState({toggleActive: !this.state.toggleActive}))}>
                  Confirm
                </button>
                <button type="button" className="btn btn-primary m-1" onClick={e=>this.toast('Failed!', 'error')}>Toast
                </button>
                <button type="button" className="btn btn-primary m-1"
                        onClick={e=>this.openModal(<div><div>Custom Modal Content Here</div><button className="btn btn-primary" onClick={()=>this.closeModal()}>Do Something and Close</button></div>, 'Optional Title')}>
                  Open Modal
                </button>
                <button type="submit" className="btn btn-primary m-1"
                        onClick={e=>this.alert('Valid: ' + this.refs.form3.valid(), 'Error')}>Validate
                </button>
              </FormAction>
            </FormGroup>
          </div>
        </div>
        <NavPill defaultActiveIndex={1} tabTitles={["Tab1","Tab2","Tab3"]}
                 tabContents={[<div>Tab1 Content</div>,
                              <ResponsiveContainer width="100%" height={300}>
                                <ComposedChart width={800} height={400} data={data}
                                  margin={{ top: 20, right: 20, bottom: 5, left: 20 }}>
                                  <XAxis dataKey="name" />
                                  <YAxis />
                                  <Legend layout="vertical" align="right" verticalAlign="middle"/>
                                  <CartesianGrid stroke="#f5f5f5" />
                                  <Tooltip />
                                  <Area type="monotone" dataKey='amt' fill="#8884d8" stroke="#8884d8" />
                                  <Line type="monotone" dataKey="uv" stroke="#ff7300" />
                                  <Bar dataKey="pv" barSize={20} fill="#413ea0" />
                                  <Brush>
                                    <LineChart>
                                      <Line dataKey="uv" stroke="#ff7300" dot={false} />
                                    </LineChart>
                                  </Brush>
                                </ComposedChart>
                              </ResponsiveContainer>,
         <div>Tab3 Content</div>]}
                 onActiveIndexChange={(activeIndex, prevIndex)=>this.alert('Current active index: ' + activeIndex + ' previous active index: ' + prevIndex)}/>
        <Signature title="My Name" />
      </div>
    )
  }
}
