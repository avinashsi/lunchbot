const moniker = require('moniker')

function generateRandomTeamName () {
    return moniker.choose()
}

module.exports = {
  generateRandomTeamName
}

