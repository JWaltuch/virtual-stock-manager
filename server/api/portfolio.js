const router = require('express').Router()
const {Stock} = require('../db/models')
const axios = require('axios')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    let portfolio = await Stock.findAll({
      where: {id: req.user.id}
    })
    //Because promises do not resolve in synchronous map function,
    //catch all promises
    let promises = portfolio.map(async stock => {
      try {
        let stockData = await axios.get(
          `https://cloud.iexapis.com/stable/stock/${stock.symbol}/quote?token=${
            process.env.IEX_API
          }`
        )
        stock.dataValues.value =
          stockData.data.iexRealtimePrice * 1000 * +stock.totalShares
        return stock
      } catch (err) {
        next(err)
      }
    })
    //Wait for promises to resolve, then update portfolio with values
    portfolio = await Promise.all(promises)
    res.json(portfolio)
  } catch (err) {
    next(err)
  }
})
