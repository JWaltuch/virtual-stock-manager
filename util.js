// Utility function for checking if market is closed right now
const isAfterMarketClose = currentDate =>
  currentDate.getHours() < 9 ||
  (currentDate.getHours() === 9 && currentDate.getMinutes < 45) ||
  currentDate.getHours() > 16

module.exports = {isAfterMarketClose}
