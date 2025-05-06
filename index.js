const { Client, GatewayIntentBits } = require('discord.js');
const { DisTube } = require('distube');
const { SpotifyPlugin } = require('@distube/spotify');
const { YtDlpPlugin } = require('@distube/yt-dlp');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
});

const distube = new DisTube(client, {
  leaveOnStop: false,
  emitNewSongOnly: true,
  plugins: [new SpotifyPlugin(), new YtDlpPlugin()]
});

client.once('ready', () => {
  console.log(`✅ Bot conectado como ${client.user.tag}`);
});

client.on('messageCreate', async message => {
  if (!message.guild || message.author.bot) return;

  const prefix = '!';
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'play') {
    if (!message.member.voice.channel) return message.reply('❌ Debes estar en un canal de voz');
    const query = args.join(' ');
    distube.play(message.member.voice.channel, query, {
      textChannel: message.channel,
      member: message.member
    });
  }

  if (command === 'stop') {
    distube.stop(message);
    message.channel.send('🛑 Música detenida.');
  }

  if (command === 'skip') {
    distube.skip(message);
    message.channel.send('⏭ Canción saltada.');
  }

  if (command === 'queue') {
    const queue = distube.getQueue(message);
    if (!queue) return message.channel.send('📭 No hay canciones en la cola.');
    message.channel.send(
      '🎶 Cola actual:\n' +
      queue.songs
        .map((song, id) => `${id === 0 ? '▶️' : `${id}.`} ${song.name} - \`${song.formattedDuration}\``)
        .join('\n')
    );
  }
});

client.login('TU_TOKEN_AQUÍ');
