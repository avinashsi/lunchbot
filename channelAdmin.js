'use strict';

const fs = require('fs');
const { WebClient } = require('@slack/web-api');
console.log('Lunchbot started');
const tokens = require('./secrets.json')

const web = new WebClient(tokens.oAuthToken);
async function createChannelAndNotify (newChannelName) {

    //archive channels
    console.log('archive channels');
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

    console.log('Create new channel' + newChannelName);
    let result = await web.channels.create(
        {
            "name": newChannelName
        }
    )
    await web.channels.setTopic(
        {
            "channel": result.channel.id,
            "topic" : "Hey lovely commercetoolers. It's lunch roulette time again: Go for lunch with people you are normally not and get to know each other."
        }
    )


    console.log('Inform user');
    await web.chat.postMessage(
        {
            "token": tokens.botUserOAuthTokenToken,
            "channel": "lunch-muc",
            "text": `Hola chicos and habibis <!here> , this Wednesday is lunch roulette day! Join <#${result.channel.id}> for a whole new lunch experience :all-the-things:!`
        }
    );

    return result.channel.id
}

module.exports = { createChannelAndNotify }
