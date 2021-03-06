import { injectReducer } from '../../store/reducers'

export default (store) => ({
  path: 'policies',
  /*  Async getComponent is only invoked when route matches   */
  getComponent (nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
     and embed an async module loader (jsonp) when bundling   */
    require.ensure([], (require) => {
      /*  Webpack - use require callback to define
       dependencies for bundling   */
      const Policies = require('./containers/PoliciesContainer').default
      const reducer = require('./modules/reducer').default

      /*  Add the reducer to the store on key 'counter'  */
      injectReducer(store, { key: 'policies', reducer })

      /*  Return getComponent   */
      cb(null, Policies)

      /* Webpack named bundle   */
    }, 'policies')
  }
})
