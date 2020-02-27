import axios from 'axios'

/**
 * ACTION TYPES
 */
const GOT_PORTFOLIO = 'GOT_PORTFOLIO'

/**
 * INITIAL STATE
 */
const defaultPortfolio = []

/**
 * ACTION CREATORS
 */
const gotPortfolio = portfolio => ({type: GOT_PORTFOLIO, portfolio})

/**
 * THUNK CREATORS
 */
export const getPortfolio = () => async dispatch => {
  try {
    const res = await axios.get('/api/portfolio')
    dispatch(gotPortfolio(res.data || defaultPortfolio))
  } catch (err) {
    console.error(err)
  }
}

/**
 * REDUCER
 */
export default function(state = defaultPortfolio, action) {
  switch (action.type) {
    case GOT_PORTFOLIO:
      return action.portfolio
    default:
      return state
  }
}
