const appConfig  =  require('./app-config')

const commercetoolsBerlinOfficeLatLon = [lat, long]

const googleMapsClient = require('@google/maps').createClient({
  key: appConfig.googleMapsKey,
  Promise: Promise
});

async function getRestaurantsNearBy() {
  try {
    const { json: { results } } = await googleMapsClient.placesNearby({
      language: 'en',
      location: commercetoolsBerlinOfficeLatLon,
      radius: 500,
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
    console.log(JSON.stringify(e));
    return "No restaurants nearby.."
  }
}

module.exports = {
  getRestaurantsNearBy
};
