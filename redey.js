const { ActivityType } = require('discord.js');

function handleReady(client) {
  console.log(`ログイン成功: ${client.user.tag}`);
  client.user.setActivity('/help でコマンド確認', { type: ActivityType.Listening });
}

module.exports = handleReady;
