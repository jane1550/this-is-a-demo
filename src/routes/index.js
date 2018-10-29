// We only need to import the modules necessary for initial render
import CoreLayout from '../layouts/PageLayout/PageLayout'
import ProductList from './ProductList'
import Me from './Me'
import Example from './Example'
import Login from './Login'
import Policies from './Policies'
import Claim from './Claim'
import CS from './CS'
import Orders from './Orders'
import Product from './Product'
import Proposal from './Proposal'
import UserProfile from './UserProfile'
import Plan from './Plan'
import Quotations from './Quotations'
import Policy from './Policy'

/*  Note: Instead of using JSX, we recommend using react-router
    PlainRoute objects to build route definitions.   */

export const createRoutes = (store) => ({
  path: '/',
  component: CoreLayout,
  indexRoute: ProductList(store),
  childRoutes: [
    Me(store),
    Example(store),
    Login(store),
    Policies(store),
    Claim(store),
    CS(store),
    Orders(store),
    Product(store),
    Proposal(store),
    UserProfile(store),
    Plan(store),
    Quotations(store),
    Policy(store),
  ]
})

/*  Note: childRoutes can be chunked or otherwise loaded programmatically
    using getChildRoutes with the following signature:

    getChildRoutes (location, cb) {
      require.ensure([], (require) => {
        cb(null, [
          // Remove imports!
          require('./Counter').default(store)
        ])
      })
    }

    However, this is not necessary for code-splitting! It simply provides
    an API for async route definitions. Your code splitting should occur
    inside the route `getComponent` function, since it is only invoked
    when the route exists and matches.
*/

export default createRoutes
