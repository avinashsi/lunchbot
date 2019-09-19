'use strict';

const fs = require('fs');
const { WebClient } = require('@slack/web-api');
const teamNameGenerator = require('./team-name-generator');
console.log('Lunchbot started');
const tokens = require('./secrets.json')

const web = new WebClient(tokens.oAuthToken);
(async () => {

  await notifyAboutNextRouletteInGeneralRoom();
  await sendRandomNameToBerlinRouletter();

  console.log('Message posted!');
})();

async function notifyAboutNextRouletteInGeneralRoom() {
  return web.chat.postMessage(
    {
      "channel": "lunch-roulette-berlin",
      "text": `Hola <!here> , next Wednesday is lunch roulette day! Join <#CNHQS1NQ5> for a whole new lunch experience :all-the-things:!`
    }
  );
}

async function sendRandomNameToBerlinRouletter() {
  return web.chat.postMessage(
    {
      "channel": "lunch-roulette-berlin",
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



