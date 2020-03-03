import React, {Component} from 'react'
import {connect} from 'react-redux'
import {addTransaction} from '../store/transaction'

/**
 * COMPONENT
 */
class TransactionForm extends Component {
  constructor(props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  handleSubmit = event => {
    event.preventDefault()
    let input = {
      symbol: event.target.symbol.value,
      shares: event.target.shares.value,
      type: 'BUY'
    }
    this.props.addTransaction(input)
  }

  render() {
    return (
      <div>
        <form onSubmit={event => this.handleSubmit(event)}>
          <div>
            <label htmlFor="symbol">Ticker Symbol: </label>
            <input name="symbol" placeholder="Ticker Symbol" />
          </div>
          <div>
            <label htmlFor="shares">Quantity: </label>
            <input name="shares" placeholder="1" defaultValue={1} />
          </div>
          <div>
            <button type="submit">BUY</button>
          </div>
          {this.props.error &&
            this.props.error.response && (
              <div> {this.props.error.response.data} </div>
            )}
        </form>
      </div>
    )
  }
}

const mapState = state => {
  return {
    error: state.transaction.error
  }
}

const mapDispatch = dispatch => {
  return {
    addTransaction: input => dispatch(addTransaction(input))
  }
}

export default connect(mapState, mapDispatch)(TransactionForm)
