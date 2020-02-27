const Sequelize = require('sequelize')
const db = require('../db')

const Stock = db.define('stock', {
  symbol: {
    type: Sequelize.STRING,
    allowNull: false
  },
  totalShares: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
})

//Class method to handle updating stock quantity if purchasing more
//shares of the same stock
Stock.findOrUpdate = async function(symbol, shares) {
  let existingStock = await Stock.findOne({
    where: {
      symbol: symbol
    }
  })
  if (existingStock) {
    let newTotalShares = existingStock.totalShares + shares
    await Stock.update(
      {totalShares: newTotalShares},
      {where: {id: existingStock.id}}
    )
    return existingStock
  } else {
    return Stock.create({
      symbol,
      shares
    })
  }
}

module.exports = Stock
