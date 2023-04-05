const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, StringSelectMenuBuilder, PermissionsBitField } = require('discord.js');
const voiceUser = require("../../../Schemas/voiceUser")

const voiceGuild = require("../../../Schemas/voiceGuild")

const messageUser = require("../../../Schemas/messageUser")

const messageGuild = require("../../../Schemas/messageGuild")
const moment = require('moment')
require('moment-duration-format');
require('moment-timezone');
module.exports = {
  config: {
    name: "topstat",
    description: "Stat Sıralaması",
  },
  permissions: ['SendMessages'],
  owner: false,
  run: async (client, message, args, prefix, config) => {
    let member = message.mentions.users.first() || message.guild.members.cache.get(args[0]) || message.member;    
    const messageUsersData = await messageUser.find({ guildID: message.guild.id }).sort({ topStat: -1 }); 
    const voiceUsersData = await voiceUser.find({ guildID: message.guild.id }).sort({ topStat: -1 });
     const messageGuildData = await messageGuild.findOne({ guildID: message.guild.id }); 
     const voiceGuildData = await voiceGuild.findOne({ guildID: message.guild.id }); 
     const messageUsers = messageUsersData.splice(0, 15).map((x, index) => `\`${index == 0 ? `1.` : `${index+1}.`}\` <@${x.userID}>: \`${Number(x.topStat).toLocaleString()} mesaj\``).join(`\n`); 
     const voiceUsers = voiceUsersData.splice(0, 15).map((x, index) => `\`${index == 0 ? `1.` : `${index+1}.`}\` <@${x.userID}>: \`${moment.duration(x.topStat).format("H [saat], m [dakika] s [saniye]")}\``).join(`\n`); 
     const mesaj = `Toplam üye mesajları: \`${Number(messageGuildData ? messageGuildData.topStat : 0).toLocaleString()} mesaj\`\n\n${messageUsers.length > 0 ? messageUsers : "Veri Bulunmuyor."}`; 
     const ses = `Toplam ses verileri: \`${moment.duration(voiceGuildData ? voiceGuildData.topStat : "Veri Bulunmuyor.").format("H [saat], m [dakika]")}\`\n\n${voiceUsers.length > 0 ? voiceUsers : "Veri Bulunmuyor."}`
    message.channel.send({ embeds: [new EmbedBuilder()
        .setThumbnail(message.guild.iconURL({ dynamic: true, size: 2048 }))
        .setColor("2F3136")
        .setDescription(`**Merhaba ${member}, aşşağıda listelenmiş verileri inceleyip ses ve mesaj istatistiklerini öğrenebilirsin.**\n
**Ses Kanallarının İstatistikleri** \n ${ses}
**Mesaj Kanallarının İstatistikleri** \n ${mesaj}     
`)] })


}
}