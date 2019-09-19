const secrets = require('./secrets.json')

const commercetoolsBerlinOfficeLatLon = [52.4736144, 13.4578575]

const googleMapsClient = require('@google/maps').createClient({
  key: secrets.googleMapsKey,
  Promise: Promise
});

(async () => {
  const results = await getRestaurantsNearBy();
  console.log(results);
})();

async function getRestaurantsNearBy() {
  try {
    const { json: { results } } = await googleMapsClient.placesNearby({
      language: 'en',
      location: commercetoolsBerlinOfficeLatLon,
      radius: 1000,
      minprice: 1,
      maxprice: 4,
      opennow: true,
      type: 'restaurant'
    })
      .asPromise()

    return results.map(result => {
      return {
        name: result.name, vicinity: result.vicinity
      }
    })
  } catch (e) {
    console.log(JSON.stringify(e))
    return "No restaurants nearby.."
  }
}

module.exports = {
  getRestaurantsNearBy
}
