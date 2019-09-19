'use strict';

const fs = require('fs');
const {WebClient} = require('@slack/web-api');
console.log('Lunchbot started');
const tokens = require('./secrets.json')

const web = new WebClient(tokens.oAuthToken);
(async () => {

    //await web.chat.postMessage(JSON.parse(fs.readFileSync('message.json')));
    let channelRouletteBerlinID = "CNHQS1NQ5";
    let channelInfo = await web.channels.info(
        {
            "channel": channelRouletteBerlinID
        })

    let allUsersInChannel = channelInfo.channel.members;
    //await web.chat.postMessage(JSON.parse(fs.readFileSync('message.json')));
    allUsersInChannel.forEach(function (user) {
        web.channels.kick(
            {
                "channel": channelRouletteBerlinID,
                "user": user.id
            }
        )

    })
    //set topic

    await web.channels.setTopic(
        {
            "channel": channelRouletteBerlinID,
            "topic": 'new toppppic'
        }
    )


    console.log('channel  created!');
})();
