import React from 'react'

/**
 * COMPONENT
 */
export const Transaction = props => {
  const {transaction} = props
  const dateOfTransaction = new Date(transaction.createdAt).toLocaleString()
  const plural = transaction.shares > 1 ? 's' : ''

  return (
    <div className="line-item">
      <div className="column">
        {transaction.type}: ({transaction.symbol})
      </div>
      <div className="column">
        {/* Prices are recorded accurately but rounded for cleaner display */}
        {transaction.shares} Share{plural} @
        {parseFloat(transaction.currentPrice).toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD'
        })}
      </div>
      <div className="column">{dateOfTransaction}</div>
    </div>
  )
}
