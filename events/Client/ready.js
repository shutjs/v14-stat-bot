const client = require("../../index");
const colors = require("colors");
const system = require("../../config/config")

module.exports = {
  name: "ready.js"
};

client.once('ready', async () => {
  setInterval(async () => {
    const voice = require("@discordjs/voice")

 /*   if(channel){
    voice.joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
        selfMute: true,
    });
  } */
}, 1000 * 3)
  console.log("\n" + `[READY] ${client.user.tag} kalktı ve gitmeye hazır hadi uç`.brightGreen);
})