const Sequelize = require('sequelize')
const db = require('../db')

const Transaction = db.define('transaction', {
  symbol: {
    type: Sequelize.STRING,
    allowNull: false
  },
  shares: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  type: {
    type: Sequelize.STRING,
    allowNull: false,
    values: ['BUY', 'SELL']
  },
  currentPrice: {
    type: Sequelize.DECIMAL
  }
})

module.exports = Transaction
