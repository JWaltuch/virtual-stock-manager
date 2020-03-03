const {expect} = require('chai')
const {isAfterMarketClose} = require('./util')

describe('isAfterMarketClose util function', () => {
  describe('instanceMethods', () => {
    const dateAfterMarketClose = new Date(2020, 3, 3, 20, 0, 0)
    const dateWhileMarketOpen = new Date(2020, 3, 3, 10, 0, 0)
    it('returns true if date is after market closes', () => {
      expect(isAfterMarketClose(dateAfterMarketClose)).to.be.equal(true)
    })

    it('returns false if date is while market is open', () => {
      expect(isAfterMarketClose(dateWhileMarketOpen)).to.be.equal(false)
    })
  })
})
