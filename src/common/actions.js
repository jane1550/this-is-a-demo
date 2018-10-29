export function requestData(action) {
  return {
    type: "REQUEST_DATA",
    action,
    meta: {
      loading: true
    }
  }
}

export function receiveError(error) {
  return {
    type: "RECEIVE_ERROR",
    error,
    meta: {
      loading: false
    }
  }
}
