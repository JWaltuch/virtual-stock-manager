const Sequelize = require('sequelize')
const db = require('../db')

const Stock = db.define('stock', {
  symbol: {
    type: Sequelize.STRING,
    allowNull: false
  },
  totalQuantity: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
})

module.exports = Stock
