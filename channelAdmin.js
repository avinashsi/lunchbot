'use strict';

const fs = require('fs');
const {WebClient} = require('@slack/web-api');
console.log('Lunchbot started');
const tokens = require('./secrets.json')

const web = new WebClient(tokens.oAuthToken);
(async () => {

    let newChannelName = "lunch-roulette-berlin-6";
    let roulettPrefix="lunch-roulette'"
    //archive channels

    let channelList = await web.channels.list({
        "token": tokens.botUserOAuthTokenToken,
        "exclude_archived": true

    })
    channelList.channels.forEach(function (channel) {
        if (channel.name.includes('lunch-roulette')) {
            web.channels.archive(
                {
                    "channel": channel.id,

                }
            )
        }
    })

    //Create new channel
   await web.channels.create(
        {
            "name": newChannelName
        }
    )
//Inform User
    await web.chat.postMessage(
        {
            "token": tokens.botUserOAuthTokenToken,
            "channel": "lunch-muc",
            "text": `Hola commercetoolers, the Lunchroulett goes into the next round! Join #${newChannelName} for some fun :all-the-things:!`
        }
    );




    console.log('channel  created!');
})();
