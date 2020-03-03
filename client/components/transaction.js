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
        {/* Prices are recorded accurately but rounded for cleaner display */}
        {transaction.shares} Share(s) @
        {parseFloat(transaction.currentPrice).toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD'
        })}
      </div>
    </div>
  )
}
