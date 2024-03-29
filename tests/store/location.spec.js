import {
  LOCATION_CHANGE,
  locationChange,
  updateLocation,
  //test
  default as locationReducer
} from 'store/location'

describe('(Internal Module) Location', () => {
  it('Should export a constant LOCATION_CHANGE.', () => {
    expect(LOCATION_CHANGE).to.equal('LOCATION_CHANGE')
  })

  describe('(Reducer)', () => {
    it('Should be a function.', () => {
      expect(locationReducer).to.be.a('function')
    })

    it('Should initialize with a location object.', () => {
      expect(locationReducer(undefined, {})).to.be.an('object')
      expect(locationReducer(undefined, {})).to.have.property('pathname')
    })

    it('Should return the previous state if an action was not matched.', () => {
      let state = locationReducer(undefined, {})
      expect(state).to.be.an('object')
      expect(state).to.have.property('pathname')
      expect(state).to.have.property('pathname', '/context.html')
      state = locationReducer(state, { type: '@@@@@@@' })
      expect(state).to.have.property('pathname', '/context.html')

      const locationState = { pathname: '/yup' }
      state = locationReducer(state, locationChange(locationState))
      expect(state).to.equal(locationState)
      expect(state).to.have.property('pathname', '/yup')
      state = locationReducer(state, { type: '@@@@@@@' })
      expect(state).to.equal(locationState)
      expect(state).to.have.property('pathname', '/yup')
    })
  })

  describe('(Action Creator) locationChange', () => {
    it('Should be exported as a function.', () => {
      expect(locationChange).to.be.a('function')
    })

    it('Should return an action with type "LOCATION_CHANGE".', () => {
      expect(locationChange()).to.have.property('type', LOCATION_CHANGE)
    })

    it('Should assign the first argument to the "payload" property.', () => {
      const locationState = { pathname: '/yup' }
      expect(locationChange(locationState)).to.have.property('payload', locationState)
    })

    it('Should default the "payload" property to "/" if not provided.', () => {
      expect(locationChange()).to.have.property('payload', '/')
    })
  })

  describe('(Specialized Action Creator) updateLocation', () => {
    let _globalState
    let _dispatchSpy

    beforeEach(() => {
      _globalState = {
        location : locationReducer(undefined, {})
      }
      _dispatchSpy = sinon.spy((action) => {
        _globalState = {
          ..._globalState,
          location : locationReducer(_globalState.location, action)
        }
      })
    })

    it('Should be exported as a function.', () => {
      expect(updateLocation).to.be.a('function')
    })

    it('Should return a function (is a thunk).', () => {
      expect(updateLocation({ dispatch: _dispatchSpy })).to.be.a('function')
    })

    it('Should call dispatch exactly once.', () => {
      updateLocation({ dispatch: _dispatchSpy })('/')
      expect(_dispatchSpy.should.have.been.calledOnce)
    })
  })
})
