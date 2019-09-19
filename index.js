'use strict';

const fs = require('fs');
const {WebClient} = require('@slack/web-api');
console.log('Lunchbot started');
const tokens = require('./secrets.json')

const web = new WebClient(tokens.oAuthToken);
(async () => {

    //await web.chat.postMessage(JSON.parse(fs.readFileSync('message.json')));

    let newChannelName = "lunch-roulette-berlin-25.9.2019";
    await web.channels.create(
        {
            "name": newChannelName
        }
    )

    await web.chat.postMessage(
        {
            "channel": "lunch-muc",
            "text": `Hola commercetoolers, on Wednesday is lunch roulette time! Join ${newChannelName}
             for all the fun :all-the-things:!`
        }
    );

    console.log('Message posted!');
})();
