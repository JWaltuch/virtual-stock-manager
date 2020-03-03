const router = require('express').Router()
const axios = require('axios')
const {Transaction} = require('../db/models')
const {Stock} = require('../db/models')
const {User} = require('../db/models')
const {isAfterMarketClose} = require('../../util')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const transactions = await Transaction.findAll({
      where: {userId: req.user.id},
      order: ['id']
    })
    res.json(transactions)
  } catch (err) {
    next(err)
  }
})

// Functions for post request

const getStockData = async symbol => {
  try {
    let stockData = await axios.get(
      `https://cloud.iexapis.com/stable/stock/${symbol}/quote?token=${
        process.env.IEX_API
      }`
    )
    return stockData.data
  } catch (error) {
    console.log('ERROR', error)
    throw new Error(`${symbol} is an invalid symbol.`)
  }
}

const validateQuantity = shares => {
  if (!Number.isInteger(shares) || shares <= 0) {
    throw new Error('Quantities must be whole numbers.')
  }
}

router.post('/', async (req, res, next) => {
  //req body will have symbol, shares, and type
  let {symbol, type, shares} = req.body
  shares = +shares
  try {
    // 1. check if quantity is whole number
    validateQuantity(shares)
    // 2. check if symbol is valid
    const stockData = await getStockData(symbol)
    // 3. get current price of stock and convert to cents
    const currentPrice = isAfterMarketClose(new Date())
      ? stockData.latestPrice
      : stockData.iexRealtimePrice
    // 4. check if user has enough money for purchase
    const currentUser = await User.findOne({
      where: {id: req.user.id}
    })
    if (currentUser.accountBalance < currentPrice * shares) {
      throw new Error(
        'You do not have enough money in your account to make this purchase.'
      )
    } else {
      // 5. create transaction
      const newTransaction = await Transaction.create({
        type,
        symbol,
        shares,
        currentPrice
      })
      // 7. create stock
      const newStock = await Stock.createOrUpdate(symbol, shares)
      // 8. assign both new stock and transaction to user
      await Promise.all([
        newTransaction.setUser(currentUser),
        newStock.setUser(currentUser),
        // 7. decrease user's accountBalance
        User.update(
          {
            accountBalance: currentUser.accountBalance - currentPrice * shares
          },
          {where: {id: req.user.id}}
        )
      ])
      res.status(201).json(newTransaction)
    }
  } catch (err) {
    next(err)
  }
})
