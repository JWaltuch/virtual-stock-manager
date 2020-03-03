/* global describe beforeEach it */

const {expect} = require('chai')
const request = require('supertest')
const db = require('../db')
const app = require('../index')
const Stock = db.model('stock')
const User = db.model('user')

if (process.env.NODE_ENV !== 'production') require('../../secrets')

describe('Portfolio routes', () => {
  beforeEach(() => {
    return db.sync({force: true})
  })

  describe('/api/portfolio/', async () => {
    let user
    beforeEach(async () => {
      user = await User.create({
        name: 'Cody King',
        email: 'cody@email.com',
        password: '1234',
        accountBalance: 90000000.0
      })
      let stock = await Stock.createOrUpdate('aapl', '1')
      await stock.setUser(user)
      stock = await Stock.createOrUpdate('mu', '1')
      await stock.setUser(user)
      stock = await Stock.createOrUpdate('m', '1')
      await stock.setUser(user)
      stock = await Stock.createOrUpdate('aapl', '1')
      await stock.setUser(user)
    })

    it('GET /api/portfolio', async () => {
      let agent = request.agent(app)
      await agent
        .post('/auth/login')
        .send({name: user.username, email: user.email, password: '1234'})
      const res = await agent.get('/api/portfolio').expect(200)

      expect(res.body).to.be.an('array')
      expect(res.body[1].symbol).to.be.equal('mu')
    })
  })
})
