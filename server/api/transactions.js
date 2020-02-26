const router = require('express').Router()
const {Transaction} = require('../db/models')
const {User} = require('../db/models')
const axios = require('axios')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const transactions = await Transaction.findAll({
      where: {id: req.user.id}
    })
    res.json(transactions)
  } catch (err) {
    next(err)
  }
})

router.post('/', async (req, res, next) => {
  //req body will have ticker, purchaseQuantity, and type
  let {ticker} = req.body
  let {type} = req.body
  let {purchaseQuantity} = req.body
  purchaseQuantity = +purchaseQuantity
  try {
    // 1. check if quantity is whole number
    if (!Number.isInteger(purchaseQuantity)) {
      throw new Error('Quantities must be whole numbers.')
    }
    // 2. check if ticker is valid
    let stockData = await axios.get(
      `https://cloud.iexapis.com/stable/stock/${ticker}/quote?token=${
        process.env.IEX_API
      }`
    )
    stockData = stockData.data
    if (stockData.iexRealtimePrice) {
      // 3. get current price of stock and convert to cents
      let currentPrice = +stockData.iexRealtimePrice * 1000
      // 4. check if user has enough money for purchase
      const currentUser = await User.findOne({
        where: {id: req.user.id}
      })
      if (currentUser.accountBalance < currentPrice) {
        throw new Error(
          'You do not have enough money in your account to make this purchase.'
        )
      } else {
        // 5. add transaction
        const newTransaction = await Transaction.create({
          type,
          ticker,
          purchaseQuantity,
          currentPrice
        })
        newTransaction.setUser(currentUser)
        // 6. decrease user's accountBalance
        await User.update(
          {
            accountBalance:
              currentUser.accountBalance - currentPrice * purchaseQuantity
          },
          {where: {id: req.user.id}}
        )
        res.json(newTransaction)
      }
    } else {
      throw new Error(`${ticker} is an invalid ticker.`)
    }
  } catch (err) {
    next(err)
  }
})
