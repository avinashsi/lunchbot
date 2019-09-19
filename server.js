'use strict';

const fs = require('fs');
const { WebClient } = require('@slack/web-api');
const _ = require('lodash')
const teamNameGenerator = require('./team-name-generator');
const placesRecommender = require('./places-recommendation');
console.log('Lunchbot started');
const tokens = require('./secrets.json')
const {startCreatingGroups} = require('./team-generator');



const express = require('express');
const app = express();

// [START hello_world]
// Say hello!
app.get('/', (req, res) => {
  res.status(200).send('Hello, world!');
});


const web = new WebClient(tokens.botUserOAuthTokenToken);
(async () => {

  await notifyAboutNextRouletteInGeneralRoom();
  //await sendRandomNameToBerlinRouletter();
  //await sendRestaurantRecommendations();

  console.log('Message posted!');
})();

async function sendRestaurantRecommendations() {
  let restaurantsNearby = await placesRecommender.getRestaurantsNearBy()
  let recommendations = _.shuffle(restaurantsNearby);

  return web.chat.postMessage(
    {
      "channel": "summerhack-lunchbot",
      "text": `Yo yo, restaurants recommendations are here: ${JSON.stringify(recommendations)}!`
    }
  );
}

async function notifyAboutNextRouletteInGeneralRoom() {
  return web.chat.postMessage(
    {
      "channel": "summerhack-lunchbot",
      "text": `Hola <!here> , next Wednesday is lunch roulette day! Join <#CNHQS1NQ5> for a whole new lunch experience :all-the-things:!`
    }
  );
}

async function sendRandomNameToBerlinRouletter() {
  return web.chat.postMessage(
    {
      "channel": "summerhack-lunchbot",
      "text": `Here is a random team name: ${teamNameGenerator.generateRandomTeamName()}`
    }
  );
}

async function createChannel() {
  let newChannelName = "lunch-roulette-berlin-25.9.2019";
  return web.channels.create(
    {
      "name": newChannelName
    }
  )
}

async function postMessageFromJsonFile() {
  return web.chat.postMessage(JSON.parse(fs.readFileSync('message.json')));
}

async function getChannelInfo() {
  return web.channels.info({
    "channel": "CNHQS1NQ5"
  });
}


// groups will be created in 8 seconds
//setTimeout(() => startCreatingGroups(web), 8000);
