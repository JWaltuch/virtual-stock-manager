import axios from 'axios'
import history from '../history'

/**
 * ACTION TYPES
 */
const GOT_TRANSACTIONS = 'GOT_TRANSACTIONS'
const ADDED_TRANSACTION = 'ADDED_TRANSACTION'

/**
 * INITIAL STATE
 */
const defaultTransactions = []

/**
 * ACTION CREATORS
 */
const gotTransactions = transactions => ({type: GOT_TRANSACTIONS, transactions})
const addedTransaction = newTransaction => ({
  type: ADDED_TRANSACTION,
  newTransaction
})

/**
 * THUNK CREATORS
 */
export const getTransactions = () => async dispatch => {
  try {
    const res = await axios.get('/api/transactions')
    dispatch(gotTransactions(res.data || defaultTransactions))
  } catch (err) {
    console.error(err)
  }
}

export const addTransaction = (symbol, shares, type) => async dispatch => {
  let res
  try {
    res = await axios.post(`/api/transactions`, {symbol, shares, type})
    dispatch(addedTransaction(res.data))
    history.push('/transactions')
  } catch (err) {
    console.error(err)
  }
}

/**
 * REDUCER
 */
export default function(state = defaultTransactions, action) {
  switch (action.type) {
    case GOT_TRANSACTIONS:
      return action.transactions
    case ADDED_TRANSACTION: {
      let newTransactions = [...state]
      newTransactions.push(action.newTransaction)
      return newTransactions
    }
    default:
      return state
  }
}
