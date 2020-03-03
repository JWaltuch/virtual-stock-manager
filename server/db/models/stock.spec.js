/* global describe beforeEach it */

const {expect} = require('chai')
const db = require('../index')
const Stock = db.model('stock')

describe('Stock model', () => {
  beforeEach(() => {
    return db.sync({force: true})
  })

  describe('classMethods', () => {
    describe('createOrUpdate', () => {
      let aapl

      beforeEach(async () => {
        aapl = await Stock.createOrUpdate('aapl', 1)
        aapl = aapl.dataValues
      })

      it('creates a new stock if a stock with the same symbol does not exist ', () => {
        expect(aapl.totalShares).to.be.equal(1)
      })

      it('adds shares to the stock if a stock with the same symbol exists', async () => {
        let updatedAapl = await Stock.createOrUpdate('aapl', 1)
        expect(updatedAapl.totalShares).to.be.equal(2)
      })
    })
  })
})
