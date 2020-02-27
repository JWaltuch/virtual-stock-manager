import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import Portfolio from './portfolio'

/**
 * COMPONENT
 */
export const UserHome = props => {
  const {email, accountBalance} = props

  return (
    <div>
      <h3>Welcome, {email}</h3>

      <Portfolio />

      <h2>Account Balance: ${accountBalance}</h2>
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
