const { WebClient } = require('@slack/web-api');
console.log('Lunchbot started');
const token = 'your-commit';
// Create a new instance of the WebClient class with the token read from your environment variable
const web = new WebClient(token);
// The current date
const currentTime = new Date().toTimeString();
(async () => {
  // Use the `auth.test` method to find information about the installing user
  const res = await web.auth.test()
  // Find your user id to know where to send messages to
  const userId = res.user_id
  const { user: andi } = await web.users.lookupByEmail({ email: "your.email@commercetools.de" });
// Use the `chat.postMessage` method to send a message from this app
  await web.chat.postMessage({
      channel: andi.id,
      text: `Hello from bot. The current time is ${currentTime}`,
    });
  console.log('Message posted!');
})();
