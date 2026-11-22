const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const keepAlive = require('./keepalive');
const handleReady = require('./redey');
const { joinChannel, playMusic } = require('./music');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// ボットが起動したときの処理
client.once('ready', () => {
  handleReady(client);
});

// メッセージを受け取ったときの処理（プレフィックス: /）
client.on('messageCreate', async (message) => {
  // ボット自身のメッセージは無視
  if (message.author.bot) return;

  const prefix = '/';
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  // /help コマンド
  if (command === 'help') {
    const helpEmbed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle('🎵 音楽ボット コマンド一覧')
      .setDescription('ボイスチャンネルに参加した状態で使ってください！')
      .addFields(
        { name: '`/join`', value: 'ボットを自分のいるボイスチャンネルに呼びます（音声・マイク接続）' },
        { name: '`/play [曲名またはURL]`', value: '指定した曲を検索してスピーカーから再生します' },
        { name: '`/help`', value: 'このコマンド一覧を表示します' }
      );

    return message.reply({ embeds: [helpEmbed] });
  }

  // /join コマンド
  if (command === 'join') {
    await joinChannel(message);
  }

  // /play コマンド
  if (command === 'play') {
    await playMusic(message, args);
  }
});

// RenderのWebスリープ防止サーバーを起動
keepAlive();

// Discordにログイン
client.login(process.env.TOKEN);
