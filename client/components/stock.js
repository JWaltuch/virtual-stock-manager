import React from 'react'

/**
 * COMPONENT
 */
export const Stock = props => {
  const {stock} = props

  return (
    <div>
      <div>{stock.symbol} -</div>
      <div>{stock.totalShares} Shares</div>
      <div>${stock.value / 1000}</div>
    </div>
  )
}
