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
  const plural = stock.totalShares > 1 ? 's' : ''
  return (
    <div className={`line-item ${stockStatus}`}>
      <div className="column">{stock.symbol}</div>
      <div className="column">
        {stock.totalShares} Share{plural}
      </div>
      {/* Prices are recorded accurately but rounded for cleaner display */}
      <div className="column">
        {stock.value.toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD'
        })}
      </div>
      {stockStatus === 'greater-than-open' && <div className="column">↑</div>}
      {stockStatus === 'less-than-open' && <div className="column">↓</div>}
    </div>
  )
}
