const User = require('./user')
// const Stock = require('./stock')
const Transaction = require('./transaction')

// Stock.belongsTo(User)
// User.hasMany(Stock)

Transaction.belongsTo(User)
User.hasMany(Transaction)

module.exports = {
  User,
  // Stock,
  Transaction
}
