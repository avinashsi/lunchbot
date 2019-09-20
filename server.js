'use strict';

const moment = require('moment');
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

  const newChannelName = "Lunch roulette Berlin " + moment().format("DD.MM.YYYY HH:mm")

  const channelId = await createChannelAndNotify(newChannelName)
  setTimeout(() => startCreatingGroups(web, channelId), 120 * 1000)

})();
