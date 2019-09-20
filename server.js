'use strict';

const moment = require('moment');
const { WebClient } = require('@slack/web-api');
const _ = require('lodash')
console.log('Lunchbot started');
const tokens = require('./secrets.json')
const {startCreatingGroups} = require('./team-generator');
const {createChannelAndNotify} = require('./channelAdmin')
const greetings = require('./greetings.json')
const farewells = require('./farewells.json')
const botResponse = require('./bot-responses')

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

slackEvents.on('message', (event) => {
  console.log(`Received a message event: user ${event.user} in channel ${event.channel} says ${event.text}`);
});

slackEvents.on('app_mention', async (event) => {
  const message = _.shuffle(botResponse)[0]
  await web.chat.postMessage(
    {
      "channel": event.channel,
      "mrkdwn": true,
      "text": `${message} <@${event.user}>`
    }
  );
})

slackEvents.on('member_joined_channel', async (event) => {
  if (channelId === event.channel) {

    const gif = _.shuffle(greetings.gifs)[0]
    const greetingMesssageTpl = _.template(_.shuffle(greetings.all)[0])
    const greetingMesssage = greetingMesssageTpl({username: event.user}) + ' ' + gif
    await web.chat.postMessage(
      {
        "channel": channelId,
        "mrkdwn": true,
        "text": greetingMesssage
      }
    );
  }
})

slackEvents.on('member_left_channel', async (event) => {
  if (channelId === event.channel) {
    const gif = _.shuffle(farewells.gifs)[0]
    const farewellMesssageTpl = _.template(_.shuffle(farewells.all)[0])
    const farewellMesssage = farewellMesssageTpl({username: event.user}) + ' ' + gif
    await web.chat.postMessage(
      {
        "channel": channelId,
        "mrkdwn": true,
        "text": farewellMesssage
      }
    );
  }
})

// Handle errors (see `errorCodes` export)
slackEvents.on('error', console.error);

app.use('/slack/events', slackEvents.expressMiddleware());

app.listen(port, () => console.log(`Example app listening on port ${port}!`))


