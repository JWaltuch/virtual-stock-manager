import React from 'react'

const setStockStatus = stock => {
  if (stock.openingPrice === stock.value / stock.totalShares)
    return 'equal-to-open'
  if (stock.openingPrice > stock.value / stock.totalShares)
    return 'less-than-open'
  if (stock.openingPrice < stock.value / stock.totalShares)
    return 'greater-than-open'
}

/**
 * COMPONENT
 */
export const Stock = props => {
  const {stock} = props
  const stockStatus = setStockStatus(stock)
  return (
    <div className={`line-item ${stockStatus}`}>
      <div className="column">{stock.symbol}</div>
      <div className="column">{stock.totalShares} Shares</div>
      {/* Prices are recorded accurately but rounded for cleaner display */}
      <div className="column">${stock.value.toFixed(2)}</div>
    </div>
  )
}
