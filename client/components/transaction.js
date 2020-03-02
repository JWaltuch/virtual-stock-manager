import React from 'react'

/**
 * COMPONENT
 */
export const Transaction = props => {
  const {transaction} = props

  return (
    <div className="line-item">
      <div className="column">
        {transaction.type}: ({transaction.symbol})
      </div>
      <div className="column">
        {transaction.shares} Share(s) @ ${transaction.currentPrice}
      </div>
    </div>
  )
}
