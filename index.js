const { Client, Partials, Collection, GatewayIntentBits, IntentsBitField} = require('discord.js');
const Discord = require("discord.js")
const config = require('./config/config');
let Data = require(`./Schemas/Tasks`)
const { Guild } = require("./config/config")
const { joinVoiceChannel } = require('@discordjs/voice');
const moment = require("moment")

const client = new Client({
  intents:[
    Object.keys(IntentsBitField.Flags)
  ],
  partials:[
    Object.keys(Partials)
  ],
  presence: {
    activities: [{
      name: "Shut ❤️",
      type: 0
    }],
    status: 'idle'
  }
});

const discordModals = require('discord-modals'); // Define the discord-modals package!
discordModals(client);

require('http').createServer((req, res) => res.end('Ready.')).listen(3000);


const AuthenticationToken = config.Client.TOKEN;
if (!AuthenticationToken) {
  console.warn("[HATA] Discord botu için Kimlik Doğrulama Jetonu gereklidir!".red)
  return process.exit();
};



client.prefix_commands = new Collection();
client.slash_commands = new Collection();
client.user_commands = new Collection();
client.message_commands = new Collection();
client.modals = new Collection();
client.events = new Collection();

module.exports = client;

["prefix", "application_commands", "modals", "events", "mongoose"].forEach((file) => {
  require(`./handlers/${file}`)(client, config);
});


client.login(AuthenticationToken)
  .catch((err) => {
    console.error("[HATA] Botunuza bağlanırken bir sorun oluştu...");
    console.error("[HATA] Discord API'sinden gelen hata:" + err);
    return process.exit();
  });


process.on('unhandledRejection', async (err, promise) => {
  console.error(`[HATA] İşlenmemiş Reddetme: ${err}`.red);
  console.error(promise);
});



Discord.Guild.prototype.kanalBul = function (chanelName) {
  let channel = this.channels.cache.find(k => k.name === chanelName)
  return channel;
}
Discord.Guild.prototype.emojiBul = function (content) {
  let emoji = this.emojis.cache.find(e => e.name === content) || this.emojis.cache.find(e => e.id === content)
  if (!emoji) return console.log(`${content} emojisi ${this.name} sunucusuna yüklenmediğinden kullanılamadı.`, "error");
  return emoji;
}
Promise.prototype.sil = function (time) {
  if (this) this.then(message => {
    if (message.deletable)
      setTimeout(() => message.delete(), time * 1000)
  });
};

Array.prototype.random = function () {
  return this[Math.floor((Math.random() * this.length))];
};


client.getTime = (time) => {
		
  // if (!time) throw new ReferenceError("Time Is Not Defined");
  if (isNaN(time) || time.toLocaleString().includes('-')) throw new TypeError("Invalid Argument : Time");
  let date = moment.duration(time)._data;

  if (date.years) return `${date.years} yıl${date.months ? `, ${date.months} ay` : ``}${date.days ? `, ${date.days} gün` : ``}`
  if (date.months) return `${date.months} ay${date.days ? `, ${date.days} gün` : ``}${date.hours ? `, ${date.hours} saat` : ``}`
  if (date.days) return `${date.days} gün${date.hours ? `, ${date.hours} saat` : ``}${date.minutes ? `, ${date.minutes} dakika`: ``}`;
  if (date.hours) return `${date.hours} saat${date.minutes ? `, ${date.minutes} dakika` : ``}${date.seconds ? `, ${date.seconds} Saniye` : ``}`;
if (date.minutes) return `${date.minutes} dakika${date.seconds ? `, ${date.seconds} Saniye` : ``}`;
if (date.seconds) return `${date.seconds} Saniye`;

  // if (date.minutes) return date.minutes < 5 ? `Birkaç Dakika` : date.minutes > 45 ? `Yaklaşık 1 Saat` : `${date.minutes} Dakika`;
  // if (date.seconds) return date.seconds < 15 ? `Birkaç Saniye` : date.seconds > 45 ? `Yaklaşık 1 Dakika` : `${date.seconds} Saniye`;
};
