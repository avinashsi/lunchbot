const teamNameGenerator = require('./team-name-generator');
const topicGenerator = require('./topic-generator');

async function startCreatingGroups(web) {

  // channel ID  CNJKD4D4P
  const channelID = 'CNJKD4D4P'
  let result;
  try {
    result = await web.apiCall('conversations.members', {channel: channelID})
  } catch (err) {
    console.log(err);
    console.log('Channel for lunchbot is not available! :disappointed')
    return;
  }

  const membersArray = result.members;

  try {
    const promises = membersArray.map(element => {
      return web.apiCall('users.info', {user: element})
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
          "channel": "lunch-muc",
          "mrkdwn": true,
          "text": groupMessage
        }
    );

  } catch (err) {
    console.log(err);
    console.log('Channel could not found. May be the channel with ID : ' + channelID +
        ' has deleted.')
  }
}

function chunk(arr, size, min) {
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

  removeBotUser(userList);
  shuffleArray(userList);

  let messageText = "";
  let size = userList.length;

  if (size > 0) {
    const motherArray = chunk(userList, 3, 2);
    for (const realList of motherArray) {
      messageText += "_Lunch Crew_ *" + teamNameGenerator.generateRandomTeamName() + '* :awesome: :all-the-things: \n';
      const randomTopic = await topicGenerator.generateRandomTopic();

      messageText += getUserMention(messageText, realList, 0, realList.length) +"\n";

      messageText += 'Did you know that ' + randomTopic + " :scream: :scream: :scream: :interrobang:";
      messageText += '\n =========================================================== \n';
    }
    return messageText;
  } else {
    return 'Sorry, not enough people :disappointed :disappointed :disappointed';
  }

}

function getUserMention(message, array, from, to) {
  return array.map((user, i) => {
    return (i+1) + '. <@' + user.id + '>';
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


module.exports = {startCreatingGroups};