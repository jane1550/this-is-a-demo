import { injectReducer } from '../../store/reducers'

export default (store) => ({
  path: 'example',
  /*  Async getComponent is only invoked when route matches   */
  getComponent (nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
     and embed an async module loader (jsonp) when bundling   */
    require.ensure([], (require) => {
      /*  Webpack - use require callback to define
       dependencies for bundling   */
      const Example = require('./containers/ExampleContainer').default
      const reducer = require('./modules/reducer').default

      /*  Add the reducer to the store on key 'counter'  */
      injectReducer(store, { key: 'example', reducer })

      /*  Return getComponent   */
      cb(null, Example)

      /* Webpack named bundle   */
    }, 'example')
  }
})
