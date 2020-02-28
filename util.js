// Utility function for comparing dates to when market opens
// Checks if the last updated date === today
// Then, checks if it is after 9:45AM EST, which is when market opens

const datesAreSameDay = (lastUpdate, currentDate) =>
  lastUpdate.getFullYear() === currentDate.getFullYear() &&
  lastUpdate.getMonth() === currentDate.getMonth() &&
  lastUpdate.getDate() === currentDate.getDate() &&
  (lastUpdate.getHours() > 9 ||
    (lastUpdate.getHours() === 9 && lastUpdate.getMinutes > 45))

module.exports = datesAreSameDay
