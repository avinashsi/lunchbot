'use strict';

const fs = require('fs');
const { WebClient } = require('@slack/web-api');
const _ = require('lodash')
console.log('Lunchbot started');
const tokens = require('./secrets.json')
const {startCreatingGroups} = require('./team-generator');
const {createChannelAndNotify} = require('./channelAdmin')



const express = require('express');
const app = express();

// [START hello_world]
// Say hello!
app.get('/', (req, res) => {
  res.status(200).send('Hello, world!');
});


const web = new WebClient(tokens.botUserOAuthTokenToken);
(async () => {

  const newChannelName = "lunch-roulette-berlin-" + new Date().toTimeString()
  
  const channelId = await createChannelAndNotify(newChannelName)
  setTimeout(() => startCreatingGroups(web, channelId), 30 * 1000)

})();