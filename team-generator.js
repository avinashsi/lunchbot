const teamNameGenerator = require('./team-name-generator');
const topicGenerator = require('./topic-generator');
const placesRecommender = require('./places-recommendation');
const _ = require('lodash')

async function startCreatingGroups(web, channelId) {


  let result;
  try {
    result = await web.apiCall('conversations.members', { channel: channelId })
  } catch (err) {
    console.log(err);
    console.log('Channel for lunchbot is not available! :disappointed')
    return;
  }

  const membersArray = result.members;

  try {
    const promises = membersArray.map(element => {
      return web.apiCall('users.info', { user: element })
        .then(res => {
          const userObj = {
            id: res.user.id,
            slackName: res.user.name,
            realName: res.user.real_name,
            email: res.user.profile.email
          }
          return userObj;
        });
    });

    const values = await Promise.all(promises)

    const groupMessage = await createGroupMessage(values);

    await web.chat.postMessage(
        {
          "channel": channelId,
          "mrkdwn": true,
          "text": groupMessage
        }
    );

  } catch (err) {
    console.log(err);
    console.log('Channel could not found. May be the channel with ID : ' + channelId +
      ' has deleted.')
  }
}

function chunk(arr, size, min) {
  if (arr.length < min)
    return [arr]
  const chunks = arr.reduce(
    (chunks, el, i) =>
      (i % size ? chunks[chunks.length - 1].push(el) : chunks.push([el])) && chunks,
    []
  );
  const l = chunks.length;

  if (chunks[l - 1].length < min) {
    const lastChunk = chunks.pop();
    let i = 0;

    while (lastChunk.length) {
      chunks[i % (l - 1)].push(lastChunk.pop());
      i += 1;
    }
  }

  return chunks;
};

async function createGroupMessage(userList) {

  shuffleArray(userList);

  let messageText = "";
  let size = userList.length;

  if (size > 0) {
    const motherArray = chunk(userList, 5, 3);
    for (const realList of motherArray) {
      messageText += "Lunch Crew Name: *" + getBetterCrewName() + '* \n\n';
      const randomTopic = await topicGenerator.generateRandomTopic();

      messageText += getUserMention(messageText, realList, 0, realList.length) + "\n";

      messageText += '\nHere\'s your lunch time topic\n*' + randomTopic + "* :scream:";
      messageText += '\n \n \n';
    }

    messageText += '\nHere are some restaurants around\n'
    messageText += await getRestaurantRecommendationsAsText()

    return messageText;
  } else {
    return 'Sorry, not enough people :disappointed :disappointed :disappointed';
  }
}

function getBetterCrewName() {
  let randomName = teamNameGenerator.generateRandomTeamName().replace('-', ' ')
  return randomName.split(' ')[0][0].toUpperCase() + randomName.split(' ')[0].slice(1)
    + ' ' + randomName.split(' ')[1][0].toUpperCase() + randomName.split(' ')[1].slice(1);
}

async function getRestaurantRecommendationsAsText() {
  let restaurants = await placesRecommender.getRestaurantsNearBy()

  return _.shuffle(restaurants)
    .slice(0, 5)
    .map((restaurant, index) => {
      return (index + 1) + '. ' + '<https://maps.google.com/?q=' + restaurant.vicinity + '|' + restaurant.name + '>';
    }).join("\n");
}

function getUserMention(message, array, from, to) {
  return array.map((user, i) => {
    return (i + 1) + '. <@' + user.id + '>';
  }).join("\n");
}

function removeBotUser(array) {
  const index = chatbotUserIndex(array);
  array.splice(index, 1);
}

function chatbotUserIndex(array) {

  var i;
  for (i = 0; i < array.length; i++) {
    if (array[i].slackName === 'ctlunchbot') {
      return i;
    }
  }
}

/**
 * Randomize array element order in-place.
 * Using Durstenfeld shuffle algorithm.
 */
function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}


module.exports = { startCreatingGroups };
