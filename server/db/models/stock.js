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

Stock.findOrUpdate = async function(symbol, totalShares) {
  let existingStock = await Stock.findOne({
    where: {
      symbol: symbol
    }
  })
  if (existingStock) {
    let newTotalShares = existingStock.totalShares + totalShares
    await Stock.update(
      {totalShares: newTotalShares},
      {where: {id: existingStock.id}}
    )
    return existingStock
  } else {
    return Stock.create({
      symbol,
      totalShares
    })
  }
}

module.exports = Stock
