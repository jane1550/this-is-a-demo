import { browserHistory } from 'react-router'
import { useBasename } from 'history'

const history = useBasename(() => browserHistory)({ basename: '/mo-app' })
export default history
