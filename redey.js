const { ActivityType } = require('discord.js');

function handleReady(client) {
  console.log(`ログイン成功: ${client.user.tag}`);
  // ステータスを設定
  client.user.setActivity('!play [曲名]', { type: ActivityType.Listening });
}

module.exports = handleReady;
