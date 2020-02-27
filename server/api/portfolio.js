const router = require('express').Router()
const {Stock} = require('../db/models')
const axios = require('axios')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    let portfolio = await Stock.findAll({
      where: {id: req.user.id}
    })
    portfolio = portfolio.map(async stock => {
      let stockData = await axios.get(
        `https://cloud.iexapis.com/stable/stock/${stock.symbol}/quote?token=${
          process.env.IEX_API
        }`
      )
      stock = {
        ...stock,
        value: stockData.iexRealtimePrice * stock.totalShares
      }
    })
    res.json(portfolio)
  } catch (err) {
    next(err)
  }
})
