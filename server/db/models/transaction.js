const Sequelize = require('sequelize')
const db = require('../db')

const Transaction = db.define('transaction', {
  stockName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  purchaseQuantity: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  type: {
    type: Sequelize.STRING,
    allowNull: false,
    values: ['BUY', 'SELL']
  }
})

module.exports = Transaction
