/**
 * Created by haydn.chen on 4/4/2018.
 */
import React from 'react'
import BaseComponent from '../../../components/BaseComponent'
import './ProposalView.scss'
import {
  FormGroup,
  FormInput,
  FormTextarea,
} from '../../../components/Forms'
import {
  deepClone
} from '../../../common/utils'
import browserHistory from '../../../common/history'

export default class ProposerInfoView extends BaseComponent {
  constructor(props) {
    super(props)
    this.state = {
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
        countryCode: "",
        email: "",
        fax: "",
        homeTel: "",
        mobileTel: "",
        officeTel: "",
        officeTelExt: "",
        registerCode: "",
        registerType: "1001",
      }
    }
  }

  componentDidMount() {
    if (this.props.proposal) {
      let organProposer = deepClone(this.props.proposal.organProposer)
      this.setState({organProposer})
    }
  }

  onOrganProposerPropertyChange(property, value, type) {
    let organProposer = this.state.organProposer
    if (type === 'int') {
      value = parseInt(value) || 0
    } else if (type === 'float') {
      value = parseFloat(value) || 0
    }
    organProposer[property] = value
    this.setState({organProposer})
  }

  onOrganProposerExtraPropertyChange(property, value, type) {
    let organProposer = this.state.organProposer
    if (type === 'int') {
      value = parseInt(value) || 0
    } else if (type === 'float') {
      value = parseFloat(value) || 0
    }
    organProposer.extraProperties[property] = value
    this.setState({organProposer})
  }

  onOrganProposerAddressPropertyChange(property, value, type) {
    let organProposer = this.state.organProposer
    if (type === 'int') {
      value = parseInt(value) || 0
    } else if (type === 'float') {
      value = parseFloat(value) || 0
    }
    organProposer.addresses[0][property] = value
    this.setState({organProposer})
  }

  save() {
    let validate = this.refs.proposerForm.valid() & this.refs.proposerAddressForm.valid()
    if (!validate) {
      this.toast('Please fill in all required fields!', 'error')
      return
    }
    let {organProposer} = this.state
    let {proposal} = this.props
    proposal.organProposer = organProposer
    this.props.actions.setProposal(proposal)
    let url = `/proposal/${this.props.params.packageCode}/insuredInfo`
    //url += '?tenantCode=' + sessionStorage.getItem('SALES_APP_TENANT_CODE')
    browserHistory.push(url)
  }

  renderContent() {
    const {organProposer} = this.state
    return (
      <div style={{paddingBottom: '70px'}}>
        <FormGroup ref="proposerForm" title="Company Info" icon={<i className="fas fa-building text-primary"/>}>
          <FormInput id="companyName" label="Company Name: " required value={organProposer.companyName}
                     onChange={value => this.onOrganProposerPropertyChange('companyName', value)}/>
          <FormInput id="registerCode" label="Register Code: " required value={organProposer.registerCode}
                     onChange={value => this.onOrganProposerPropertyChange('registerCode', value)}/>
          <FormInput id="contact" label="Contact Name: " value={organProposer.contact} required
                     onChange={value => this.onOrganProposerPropertyChange('contact', value)}/>
          <FormInput id="contactTel" type="tel" label="Contact Tel No.: " value={organProposer.contactTel} required
                     tooltip={"Example +8613912345678"}
                     onChange={value => this.onOrganProposerPropertyChange('contactTel', value.startsWith('+') ? value : "+" + value)}
                     inputMask="(+99) 99999999999" valueUnmask={true}/>
          <FormInput id="email" type="email" label="Email: " value={organProposer.email} required
                     onChange={value => this.onOrganProposerPropertyChange('email', value)}/>
          <FormInput id="fax" type="tel" label="Fax: " value={organProposer.fax}
                     onChange={value => this.onOrganProposerPropertyChange('fax', value)}/>
          <FormInput id="officeTel" type="tel" label="Office Phone No.: " value={organProposer.officeTel}
                     onChange={value => this.onOrganProposerPropertyChange('officeTel', value)}/>
          <FormInput id="officeTelExt" type="tel" label="Office Phone Ext: " value={organProposer.officeTelExt}
                     onChange={value => this.onOrganProposerPropertyChange('officeTelExt', value)}/>
          <FormGroup ref="proposerAddressForm" title="Company Address"
                     icon={<i className="fas fa-address-book text-primary"/>}>
            <FormInput id="proposerProvince" label="State/Province: " value={organProposer.addresses[0].province}
                       onChange={value => this.onOrganProposerAddressPropertyChange('province', value)}/>
            <FormInput id="proposerCity" label="City/Town: " value={organProposer.addresses[0].city}
                       onChange={value => this.onOrganProposerAddressPropertyChange('city', value)}/>
            <FormInput id="proposerRegion" label="Region/District: " value={organProposer.addresses[0].region}
                       onChange={value => this.onOrganProposerAddressPropertyChange('region', value)}/>
            <FormTextarea id="proposerAddress" label="Detail Address: " value={organProposer.addresses[0].address}
                          onChange={value => this.onOrganProposerAddressPropertyChange('address', value)}/>
            <FormInput id="proposerPostCode" label="Post Code: " value={organProposer.addresses[0].postCode}
                       onChange={value => this.onOrganProposerAddressPropertyChange('postCode', value)}/>
          </FormGroup>
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
