import {injectReducer} from '../../store/reducers'

export default (store) => ({
  path: 'product/:packageCode',
  /*  Async getComponent is only invoked when route matches   */
  getComponent(nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
     and embed an async module loader (jsonp) when bundling   */
    require.ensure([], (require) => {
      /*  Webpack - use require callback to define
       dependencies for bundling   */
      const Product = require('./containers/ProductContainer').default
      const reducer = require('./modules/reducer').default

      /*  Add the reducer to the store on key 'counter'  */
      injectReducer(store, {key: 'product', reducer})

      /*  Return getComponent   */
      cb(null, Product)

      /* Webpack named bundle   */
    }, 'product')
  }
})
