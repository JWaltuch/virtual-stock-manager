const router = require('express').Router()
const {Stock} = require('../db/models')
const axios = require('axios')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    let portfolio = await Stock.findAll({
      where: {userId: req.user.id},
      order: ['id']
    })
    //Because promises do not resolve in synchronous map function,
    //catch all promises
    let promises = portfolio.map(async stock => {
      try {
        const stockData = await axios.get(
          `https://cloud.iexapis.com/stable/stock/${stock.symbol}/quote?token=${
            process.env.IEX_API
          }`
        )
        //Get most recent opening price and update
        // const newOpeningPrice = stockData.data.previousClose
        // await Stock.update(
        //   {openingPrice: newOpeningPrice},
        //   {where: {id: stock.id}}
        // )
        stock.dataValues.openingPrice = stockData.data.previousClose
        stock.dataValues.value =
          stockData.data.iexRealtimePrice * +stock.totalShares
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
