import { injectReducer } from '../../store/reducers'

export default (store) => ({
  // path: 'productList/:pathParam(:/optionalPathParam)',
  /*  Async getComponent is only invoked when route matches   */
  getComponent (nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
     and embed an async module loader (jsonp) when bundling   */
    require.ensure([], (require) => {
      /*  Webpack - use require callback to define
       dependencies for bundling   */
      const ProductList = require('./containers/ProductListContainer').default
      const reducer = require('./modules/reducer').default

      /*  Add the reducer to the store on key 'counter'  */
      injectReducer(store, { key: 'productList', reducer })

      /*  Return getComponent   */
      cb(null, ProductList)

      /* Webpack named bundle   */
    }, 'productList')
  }
})
