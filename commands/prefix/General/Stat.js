const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, StringSelectMenuBuilder, PermissionsBitField } = require('discord.js');
const moment = require('moment')
require('moment-duration-format');
require('moment-timezone');
const messageUserChannel = require("../../../Schemas/messageUserChannel");
const messageUser = require("../../../Schemas/messageUser");
const VoiceUser = require("../../../Schemas/voiceUser")

const voiceUserChannel = require("../../../Schemas/voiceGuildChannel")
module.exports = {
  config: {
    name: "stat",
    description: "Stat Gösterir",
  },
  permissions: ['SendMessages'],
  owner: false,
  run: async (client, message, args, prefix, config) => {
    let member = message.mentions.users.first() || message.guild.members.cache.get(args[0]) || message.member;

    const Active1 = await messageUserChannel.find({ guildID: message.guild.id, userID: member.id }).sort({ channelData: -1 });

    const Active2 = await voiceUserChannel.find({ guildID: message.guild.id, userID: member.id }).sort({ channelData: -1 });


    let sesVeri = Active2.length > 0 ? Active2.splice(0, 10).filter(x => message.guild.channels.cache.has(x.channelID)).map(x => `<#${x.channelID}>: \`${moment.duration(x.channelData).format("H [saat], m [dakika]")}\``).join("\n") : "Veri bulunmuyor.";
    let mesajVeri = Active1.length > 0 ? Active1.splice(0, 10).filter(x => message.guild.channels.cache.has(x.channelID)).map(x => `<#${x.channelID}>: \`${Number(x.channelData).toLocaleString()} mesaj\``).join("\n") : "Veri bulunmuyor";
    const messageData = await messageUser.findOne({ guildID: message.guild.id, userID: member.id }); 
    const voiceData = await VoiceUser.findOne({ guildID: message.guild.id, userID: member.id });
    message.channel.send({embeds: [new EmbedBuilder()
      .setThumbnail(message.guild.iconURL({dynamic: true}))
      .setColor("2F3136")
      .setDescription(`**Merhaba ${member}, aşşağıda listelenmiş verileri inceleyip ses ve mesaj istatistiklerini öğrenebilirsin.** \n
**Mesaj Kanallarının İstatistiği** \n ${mesajVeri}     
**Ses Kanallarının İstatistiği** \n ${sesVeri} 
`)

      .addFields(
      { name: `**Günlük Ses İstatistiği**`, value:`\`${moment.duration(voiceData ? voiceData.dailyStat : 0).format("H [saat], m [dakika]")}\``, inline: true },
      { name: `**Haftalık Ses İstatistiği**`, value:`\`${moment.duration(voiceData ? voiceData.weeklyStat : 0).format("H [saat], m [dakika]")}\``, inline: true },

      )
      .setFooter({text: `Developed By Shut :)`})

    
    ]}
    );
  }
}