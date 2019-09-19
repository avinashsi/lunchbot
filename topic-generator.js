const axios = require('axios')

async function generateRandomTopic () {
  try {
    const response = await axios.get(`https://uselessfacts.jsph.pl/random.json?language=en`)
    return response.data.text
  } catch(e) {
    console.log(JSON.stringify(e))
    return "The worst thing that happened to you at CT"
  }
}

module.exports = {
  generateRandomTopic
}
