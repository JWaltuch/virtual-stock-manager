import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import Portfolio from './portfolio'
import TransactionForm from './transaction-form'

/**
 * COMPONENT
 */
export const UserHome = props => {
  const {email, accountBalance} = props
  let latestUpdate = new Date().toLocaleString()

  return (
    <div>
      <h3>Welcome, {email}</h3>

      <div className="main-page">
        <div className="panel">
          <Portfolio />
        </div>

        <h2 className="panel">
          {/* Prices are recorded accurately but rounded for cleaner display */}
          Account Balance: ${parseFloat(accountBalance).toFixed(2)}
          <TransactionForm />
        </h2>
      </div>

      <h6 className="footer">Latest Update: {latestUpdate}</h6>
    </div>
  )
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    email: state.user.email,
    accountBalance: state.user.accountBalance
  }
}

export default connect(mapState)(UserHome)

/**
 * PROP TYPES
 */
UserHome.propTypes = {
  email: PropTypes.string
}
