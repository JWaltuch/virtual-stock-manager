/* global describe beforeEach it */

const {expect} = require('chai')
const request = require('supertest')
const db = require('../db')
const app = require('../index')
const Transaction = db.model('transaction')
const User = db.model('user')

describe('Transaction routes', () => {
  beforeEach(() => {
    return db.sync({force: true})
  })

  describe('/api/transactions/', () => {
    let user
    beforeEach(async () => {
      user = await User.create({
        name: 'Cody King',
        email: 'cody@email.com',
        password: '1234',
        accountBalance: 90000000.0
      })
      let transaction = await Transaction.create({
        type: 'BUY',
        symbol: 'aapl',
        shares: 1,
        currentPrice: 2100
      })
      await transaction.setUser(user)
      transaction = await Transaction.create({
        type: 'BUY',
        symbol: 'aapl',
        shares: 1,
        currentPrice: 2100
      })
      await transaction.setUser(user)
      transaction = await Transaction.create({
        type: 'BUY',
        symbol: 'a',
        shares: 2,
        currentPrice: 2100
      })
      await transaction.setUser(user)
    })

    it('GET /api/transactions', async () => {
      let agent = request.agent(app)
      await agent
        .post('/auth/login')
        .send({name: user.username, email: user.email, password: '1234'})
      const res = await agent.get('/api/transactions').expect(200)

      expect(res.body).to.be.an('array')
      expect(res.body[1].symbol).to.be.equal('aapl')
    })

    it('POST /api/transactions', async () => {
      let agent = request.agent(app)
      await agent
        .post('/auth/login')
        .send({name: user.username, email: user.email, password: '1234'})
      const newTransaction = await agent
        .post('/api/transactions')
        .send({type: 'BUY', symbol: 'aa', shares: '2'})
        .expect(201)

      expect(newTransaction.body).to.be.an('object')
      expect(newTransaction.body.symbol).to.be.equal('aa')

      const allTransactions = await agent.get('/api/transactions').expect(200)

      expect(allTransactions.body).to.be.an('array')
      expect(allTransactions.body[3].symbol).to.be.equal('aa')
    })
  })
})
