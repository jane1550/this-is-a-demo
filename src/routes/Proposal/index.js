import { injectReducer } from '../../store/reducers'

export default (store) => ({
  path : 'proposal/:packageCode/:proposalStep(/:quotationCode/:proposalCode)',
  /*  Async getComponent is only invoked when route matches   */
  getComponent (nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
     and embed an async module loader (jsonp) when bundling   */
    require.ensure([], (require) => {
      /*  Webpack - use require callback to define
       dependencies for bundling   */
      const Proposal = require('./containers/ProposalContainer').default
      const reducer = require('./modules/reducer').default

      /*  Add the reducer to the store on key 'counter'  */
      injectReducer(store, { key: 'proposal', reducer })

      /*  Return getComponent   */
      cb(null, Proposal)

      /* Webpack named bundle   */
    }, 'proposal')
  }
})
