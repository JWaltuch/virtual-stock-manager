import React from 'react'

/**
 * COMPONENT
 */
export const Stock = props => {
  const {stock} = props
  let color = 'equal-to-open'
  if (stock.openingPrice > stock.value / stock.totalShares) {
    color = 'less-than-open'
  } else if (stock.openingPrice < stock.value / stock.totalShares) {
    color = 'greater-than-open'
  }

  return (
    <div className={`line-item ${color}`}>
      <div className="column">{stock.symbol}</div>
      <div className="column">{stock.totalShares} Shares</div>
      {/* Prices are recorded accurately but rounded for cleaner display */}
      <div className="column">${stock.value.toFixed(2)}</div>
    </div>
  )
}
