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
Stock.createOrUpdate = async function(symbol, shares) {
  //Attempt to find Stock with the same symbol
  let existingStock = await Stock.findOne({
    where: {
      symbol: symbol
    }
  })
  //If found, increase shares, and update opening price
  if (existingStock) {
    let newTotalShares = existingStock.totalShares + shares
    const [_, updatedStock] = await Stock.update(
      {totalShares: newTotalShares},
      {where: {id: existingStock.id}, returning: true, plain: true}
    )
    return updatedStock
  } else {
    //If not found, create a new stock with passed arguments
    return Stock.create({
      symbol,
      totalShares: shares
    })
  }
}

module.exports = Stock
