'use strict';

const moment = require('moment');
const {WebClient} = require('@slack/web-api');
const _ = require('lodash')
const appConfig = require('./app-config')
const {startCreatingGroups} = require('./team-generator');
const {createChannelAndNotify} = require('./channelAdmin')
const greetings = require('./greetings.json')
const farewells = require('./farewells.json')
const botResponse = require('./bot-responses')
const express = require('express');
const bodyParser = require('body-parser');
const schedule = require('node-schedule');
const basicAuth = require('express-basic-auth');

const {createEventAdapter} = require('@slack/events-api');
const web = new WebClient(appConfig.botUserOAuthTokenToken);

let channelId
const cronJobs = []
const app = express();
const port = 3000

const slackEvents = createEventAdapter(appConfig.signingSecret);
app.use('/slack/events', slackEvents.expressMiddleware());
app.use(bodyParser.urlencoded({extended: true}));
if (appConfig.basicAuthPassword) {
  app.use(basicAuth({
    users: {[appConfig.basicAuthUser]: appConfig.basicAuthPassword},
    challenge: true
  }))
}
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  const jobs = schedule.scheduleJobs
  res.render('index', {cronJobs})
});

app.post('/create-cron', (req, res) => {
  const cronExpression = req.body.cronExpression
  const channelNameToInform = req.body.channelNameToInform
  if (cronExpression && channelNameToInform) {
    const cron = schedule.scheduleJob(cronExpression, async () => {
      const newChannelName = "Lunch roulette Berlin " + moment().format("DD.MM.YYYY");
      channelId = await createChannelAndNotify(channelNameToInform, newChannelName);
      setTimeout(() => startCreatingGroups(web, channelId), 2 * 60 * 60 * 1000);
    });
    cronJobs.push(cron)
  }
  res.redirect('/');
});

app.post('/cancel-cron', (req, res) => {
  const cronJobOrder = req.body.cronJobOrder
  const cron = cronJobs.splice(cronJobOrder, 1)[0]
  cron.cancel()
  res.redirect('/');
})

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
});

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
});

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
});

// Handle errors (see `errorCodes` export)
slackEvents.on('error', console.error);

app.listen(port, () => console.log(`Lunchbot app listening on port ${port}!`));


