'use strict'

const db = require('../server/db')
const {User, Transaction, Stock} = require('../server/db/models')

async function seed() {
  await db.sync({force: true})
  console.log('db synced!')

  const user = await User.create({
    name: 'Cody King',
    email: 'cody@email.com',
    password: '1234',
    accountBalance: 90000000.0
  })

  let transaction = await Transaction.create({
    type: 'BUY',
    symbol: 'aapl',
    shares: '1',
    currentPrice: 292.14
  })
  await transaction.setUser(user)
  transaction = await Transaction.create({
    type: 'BUY',
    symbol: 'mu',
    shares: '1',
    currentPrice: 53.955
  })
  await transaction.setUser(user)
  transaction = await Transaction.create({
    type: 'BUY',
    symbol: 'm',
    shares: '1',
    currentPrice: 12.81
  })
  await transaction.setUser(user)
  transaction = await Transaction.create({
    type: 'BUY',
    symbol: 'aapl',
    shares: '1',
    currentPrice: 292.035
  })
  await transaction.setUser(user)

  let stock = await Stock.createOrUpdate('aapl', '1', 292.14)
  await stock.setUser(user)
  stock = await Stock.createOrUpdate('mu', '1', 53.955)
  await stock.setUser(user)
  stock = await Stock.createOrUpdate('m', '1', 12.81)
  await stock.setUser(user)
  stock = await Stock.createOrUpdate('aapl', '1', 292.14)
  await stock.setUser(user)

  console.log(`seeded 1 user, 4 stocks, & 4 transactions`)
  console.log(`seeded successfully`)
}

// We've separated the `seed` function from the `runSeed` function.
// This way we can isolate the error handling and exit trapping.
// The `seed` function is concerned only with modifying the database.
async function runSeed() {
  console.log('seeding...')
  try {
    await seed()
  } catch (err) {
    console.error(err)
    process.exitCode = 1
  } finally {
    console.log('closing db connection')
    await db.close()
    console.log('db connection closed')
  }
}

// Execute the `seed` function, IF we ran this module directly (`node seed`).
// `Async` functions always return a promise, so we can use `catch` to handle
// any errors that might occur inside of `seed`.
if (module === require.main) {
  runSeed()
}

// we export the seed function for testing purposes (see `./seed.spec.js`)
module.exports = seed
