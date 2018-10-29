/**
 * Created by haydn.chen on 4/10/2018.
 */
import React from 'react'
import BaseComponent from '../../../components/BaseComponent'
import './ProposalView.scss'
import browserHistory from '../../../common/history'
import {deepClone} from "../../../common/utils";

export default class ResultView extends BaseComponent {
  constructor(props) {
    super(props)
    this.state = {
      qrcode: null,
      proposal: {
        proposalCode: this.props.params.proposalCode,
        policyCode: '',
        applyCode: '',
      }
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
    this.setState({proposal})
  }

  back() {
    browserHistory.go(-6)
  }

  renderContent() {
    const {proposal} = this.state
    return (
      <div>
        <div className="d-flex flex-column justify-content-center align-items-center m-2">
          <i className="far fa-check-circle text-success text-center mt-4" style={{fontSize: '10rem'}}/>
          <h1 className="mb-2 text-success text-center">Success</h1>
          <h6 className="m-2 text-primary">Policy Number
            [{proposal.policyCode || proposal.applyCode}]</h6>
        </div>
        <div className="action-footer p-1 fixed-bottom">
          <button type="button" className="btn btn-primary btn-lg btn-block mt-0" style={{height: '70px'}}
                  onClick={this.back.bind(this)}>Back
          </button>
          <button type="button" className="btn btn-success btn-lg btn-block mt-0" style={{height: '70px'}}
                  onClick={() => browserHistory.push('/me')}>Me
          </button>
        </div>
      </div>
    )
  }
}
