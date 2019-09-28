'use strict';

const fs = require('fs');
const { WebClient } = require('@slack/web-api');
const appConfig =  require('./app-config')

const web = new WebClient(appConfig.oAuthToken);
async function createChannelAndNotify (channelNameToInform, newChannelName) {

    //archive channels
    console.log('archive channels');
    let channelList = await web.channels.list({
        "token": appConfig.botUserOAuthTokenToken,
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
            "token": appConfig.botUserOAuthTokenToken,
            "channel": channelNameToInform || "lunch-muc",
            "text": `Hola chicos and habibis <!here>, this Wednesday is lunch roulette day! Join <#${result.channel.id}> for a whole new lunch experience :all-the-things:!`
        }
    );

    return result.channel.id
}

module.exports = { createChannelAndNotify }
