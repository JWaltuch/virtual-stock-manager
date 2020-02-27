import React from 'react'

/**
 * COMPONENT
 */
export const Stock = props => {
  const {stock} = props

  return (
    <div className="line-item">
      <div className="column">{stock.symbol} -</div>
      <div className="column">{stock.totalShares} Shares</div>
      <div className="column">${stock.value / 1000}</div>
    </div>
  )
}
