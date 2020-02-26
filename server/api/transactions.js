const router = require('express').Router()
const {Transaction} = require('../db/models')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    let currentUser = req.user
    const transactions = await Transaction.findAll({
      where: {id: currentUser.id}
    })
    res.json(transactions)
  } catch (err) {
    next(err)
  }
})
