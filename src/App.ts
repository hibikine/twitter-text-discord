import * as Discord from 'discord.js';
import * as twitter from 'twitter-text';
require('dotenv').config();
const client = new Discord.Client();
const token = process.env.DISCORD_TOKEN;
console.log(token);
client.on('ready', () => {
  console.log('ready');
});
function extractText(text: string): null | string {
  const m = text.match(/```([\s\S]+)```/s);
  if (m == null) {
    return null;
  }
  return m[1].trim();
}
client.on('message', async message => {
  if (message.author.bot) {
    return;
  }
  if (message.mentions.members.find(({ id }) => id === client.user.id)) {
    const msg = message.content;
    const data = extractText(msg);
    if (data == null) {
      try {
        const sendMessage = await message.reply(
          'ツイートをバッククオート(`)3つで囲んでください。'
        );
        console.log(`sent message: ${sendMessage}`);
      } catch (e) {
        console.error(e);
      }
      return;
    }
    const len = twitter.getTweetLength(data);
    const parse = twitter.parseTweet(data);
    console.log(data);
    try {
      const sendMessage = await message.reply(
        `${
          parse.valid ? '正しいツイートです。' : 'エラーがあります。'
        }${len} 文字です。`
      );
      console.log(`sent message: ${sendMessage}`);
    } catch (e) {
      console.error(e);
    }
  }
});
client.login(token);
