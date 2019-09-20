'use strict';

const moment = require('moment');
const { WebClient } = require('@slack/web-api');
const _ = require('lodash')
console.log('Lunchbot started');
const tokens = require('./secrets.json')
const {startCreatingGroups} = require('./team-generator');
const {createChannelAndNotify} = require('./channelAdmin')

const { createEventAdapter } = require('@slack/events-api');
const slackEvents = createEventAdapter(tokens.signingSecret);


let channelId
const express = require('express');
const app = express();
const port = 3000

const web = new WebClient(tokens.botUserOAuthTokenToken);
(async () => {

  const newChannelName = "Lunch roulette Berlin " + moment().format("DD.MM.YYYY HH:mm")

  channelId = await createChannelAndNotify(newChannelName)
  setTimeout(() => startCreatingGroups(web, channelId), 120 * 1000)

})();


// [START hello_world]
// Say hello!
app.get('/', (req, res) => {
  res.status(200).send('Hello, world!');
});


slackEvents.on('member_joined_channel', async (event) => {
  if (channelId === event.channel) {
    await web.chat.postMessage(
      {
        "channel": channelId,
        "mrkdwn": true,
        "text": `Hola chico <@${event.user}>`
      }
    );
  }
})

// Handle errors (see `errorCodes` export)
slackEvents.on('error', console.error);

app.use('/slack/events', slackEvents.expressMiddleware());

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
