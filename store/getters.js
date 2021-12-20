export default {
  isAuthenticated: ((state, rootState) => {
    console.log(rootState.auth)
    return state.auth.loggedIn
  })
}
