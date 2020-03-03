const router = require('express').Router()
const axios = require('axios')
const {Transaction} = require('../db/models')
const {Stock} = require('../db/models')
const {User} = require('../db/models')
const {isAfterMarketClose} = require('../../util')
module.exports = router

// Get routes

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

// Helper functions for post routes

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

const getCurrentPrice = stockData => {
  return isAfterMarketClose(new Date())
    ? stockData.latestPrice
    : stockData.iexRealtimePrice
}

const validateUserCanAffordStock = (user, currentPrice, shares) => {
  if (user.accountBalance < currentPrice * shares) {
    throw new Error(
      'You do not have enough money in your account to make this purchase.'
    )
  }
}

// Post routes

router.post('/BUY', async (req, res, next) => {
  //req body will have symbol, shares, and type
  let {symbol, type, shares} = req.body
  shares = +shares
  try {
    // 1. Check if quantity is whole number
    validateQuantity(shares)
    // 2. Get stock data if symbol is valid
    const stockData = await getStockData(symbol)
    // 3. Get current price of stock
    const currentPrice = getCurrentPrice(stockData)
    // 4. Check if user has enough money for purchase
    const currentUser = await User.findOne({
      where: {id: req.user.id}
    })
    validateUserCanAffordStock(currentUser, currentPrice, shares)
    // 5. Create transaction
    const newTransaction = await Transaction.create({
      type,
      symbol,
      shares,
      currentPrice
    })
    // 7. Create stock
    const newStock = await Stock.createOrUpdate(symbol, shares)
    // 8. Assign both new stock and transaction to user
    await Promise.all([
      newTransaction.setUser(currentUser),
      newStock.setUser(currentUser),
      // 7. Decrease user's accountBalance
      User.update(
        {
          accountBalance: currentUser.accountBalance - currentPrice * shares
        },
        {where: {id: currentUser.id}}
      )
    ])
    res.status(201).json(newTransaction)
  } catch (err) {
    next(err)
  }
})

router.post('/SELL', async (req, res, next) => {
  //req body will have symbol, shares, and type
  let {symbol, type, shares} = req.body
  shares = +shares
  try {
    // 1. Check if quantity is whole number
    validateQuantity(shares)
    // 2. Get stock data if symbol is valid
    const stockData = await getStockData(symbol)
    // 3. Get current price of stock
    const currentPrice = getCurrentPrice(stockData)
    // 4. Check if user can sell that much stock
    const currentUser = await User.findOne({
      where: {id: req.user.id}
    })
    const stockToSell = await Stock.findOne({
      where: {symbol: symbol, userId: currentUser.id}
    })
    if (stockToSell.totalShares < shares) {
      throw new Error(`You do not own that many shares of ${symbol}`)
    }
    // 5. Create transaction
    const newTransaction = await Transaction.create({
      type,
      symbol,
      shares,
      currentPrice
    })
    // 7. Delete stock or reduce shares
    if (stockToSell.totalShares === shares) {
      await stockToSell.destroy()
    } else {
      await stockToSell.update({totalShares: stockToSell.totalShares - shares})
    }
    await Promise.all([
      // 8. Assign new transaction to user
      newTransaction.setUser(currentUser),
      // 7. Increase user's accountBalance
      currentUser.update({
        accountBalance: currentUser.accountBalance + currentPrice * shares
      })
    ])
    res.status(201).json(newTransaction)
  } catch (err) {
    next(err)
  }
})
