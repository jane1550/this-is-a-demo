import { injectReducer } from '../../store/reducers'

export default (store) => ({
  path: 'claim/:step',
  /*  Async getComponent is only invoked when route matches   */
  getComponent (nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
     and embed an async module loader (jsonp) when bundling   */
    require.ensure([], (require) => {
      /*  Webpack - use require callback to define
       dependencies for bundling   */
      const Claim = require('./containers/ClaimContainer').default
      const reducer = require('./modules/reducer').default

      /*  Add the reducer to the store on key 'counter'  */
      injectReducer(store, { key: 'claim', reducer })

      /*  Return getComponent   */
      cb(null, Claim)

      /* Webpack named bundle   */
    }, 'claim')
  }
})
