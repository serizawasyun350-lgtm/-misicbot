const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, getVoiceConnection } = require('@discordjs/voice');
const play = require('play-dl');
// Render上で音声変換を動かすための設定
process.env.FFMPEG_PATH = require('ffmpeg-static');

// ボイスチャンネルに参加する関数（マイクON・スピーカーON状態で入室）
async function joinChannel(message) {
  const voiceChannel = message.member?.voice.channel;
  if (!voiceChannel) {
    return message.reply('先にボイスチャンネルに参加してください！');
  }

  try {
    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: voiceChannel.guild.id,
      adapterCreator: voiceChannel.guild.voiceAdapterCreator,
      selfDeaf: false, // スピーカー（聞き専解除）
      selfMute: false, // マイク（音声送信を有効化）
    });

    message.reply(`🔊 **${voiceChannel.name}** に接続しました！（音声出力OK）`);
    return connection;
  } catch (error) {
    console.error(error);
    message.reply('ボイスチャンネルへの接続に失敗しました。');
  }
}

// 音楽を再生する関数
async function playMusic(message, args) {
  const voiceChannel = message.member?.voice.channel;
  if (!voiceChannel) {
    return message.reply('先にボイスチャンネルに参加してください！');
  }

  const query = args.join(' ');
  if (!query) {
    return message.reply('再生する曲名やURLを入力してください！（例: `/play 音楽名`）');
  }

  // すでに入室している場合はその接続を使い、まだなら新しく入室する
  let connection = getVoiceConnection(voiceChannel.guild.id);
  if (!connection) {
    connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: voiceChannel.guild.id,
      adapterCreator: voiceChannel.guild.voiceAdapterCreator,
      selfDeaf: false,
      selfMute: false,
    });
  }

  try {
    let searchResult = await play.search(query, { limit: 1 });
    if (!searchResult || searchResult.length === 0) {
      return message.reply('該当する曲が見つかりませんでした。');
    }

    const song = searchResult[0];
    let streamData = await play.stream(song.url);

    const player = createAudioPlayer();
    const resource = createAudioResource(streamData.stream, {
      inputType: streamData.type,
      inlineVolume: true, // 音量調整を有効化
    });
    resource.volume.setVolume(0.5); // 音量を50%に設定（爆音防止）

    connection.subscribe(player);
    player.play(resource);

    message.reply(`🎶 スピーカーから再生中: **${song.title}**`);

    player.on(AudioPlayerStatus.Idle, () => {
      // 曲が終わってもチャンネルに居残るようにしています
      message.channel.send('✅ 曲の再生が終了しました。');
    });

  } catch (error) {
    console.error(error);
    message.reply('音楽の再生中にエラーが発生しました。');
  }
}

module.exports = { joinChannel, playMusic };
