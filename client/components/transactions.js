import React, {Component} from 'react'
import {connect} from 'react-redux'
import {getTransactions} from '../store/transaction'
import {Transaction} from './transaction'

/**
 * COMPONENT
 */
class Transactions extends Component {
  componentDidMount() {
    this.props.getTransactions()
  }

  render() {
    const {transactions} = this.props
    return (
      <div>
        <h2>Transactions: </h2>
        {transactions && !transactions.error ? (
          transactions.map(transaction => (
            <Transaction key={transaction.id} transaction={transaction} />
          ))
        ) : (
          <div>Loading...</div>
        )}
      </div>
    )
  }
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    transactions: state.transaction
  }
}

const mapDispatch = dispatch => {
  return {
    getTransactions: () => dispatch(getTransactions())
  }
}

export default connect(mapState, mapDispatch)(Transactions)
