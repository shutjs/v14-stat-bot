const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, StringSelectMenuBuilder, PermissionsBitField } = require('discord.js');
const Data = require(`../../../Schemas/Tasks`)
const messageUserChannel = require("../../../Schemas/messageUserChannel");
const messageUser = require("../../../Schemas/messageUser");
const Taskmessage = require("../../../Schemas/TaskMessage");
const VoiceUser = require("../../../Schemas/voiceUser")
const TaskVoicee = require("../../../Schemas/TaskVoice")
module.exports = {
  config: {
    name: "görevlerim",
    description: "Görevlerini Gösterir",
  },
  permissions: ['SendMessages'],
  owner: false,
  run: async (client, message, args, prefix, config) => {
    let user = message.author.id;
    let taskData = await Data.findOne({ TaskMembers: user });
    let TaskMember = await Taskmessage.findOne({guildID: message.guild.id, userID: message.author.id})
    let VoiceUserr = await VoiceUser.findOne({guildID: message.guild.id, userID: message.author.id})
    let TaskVoice = await TaskVoicee.findOne({guildID: message.guild.id, userID: message.author.id})
    let embed = new EmbedBuilder()
    .setDescription(`\`\`\`css\nAlt Tarafta Görevlerin Gözükmektedir. Lütfen Görevlerini Yap!\`\`\``)
    .setTitle("Selam Görev Menüsünüe hoşgeldin")
      .setThumbnail(message.guild.iconURL())
      .setColor("2F3136")

    if (taskData && taskData.TaskSure > 0) {
      embed.addFields({ name: `Ses Görevi`, value: `\`${TaskVoice ? client.getTime(TaskVoice.topStat) : "`Veri bulunamadı!`"} / ${TaskVoice ? client.getTime(taskData.TaskSure): "`Veri Bulunamadı!`"} Sesli Süresi \`` });
    }
    if(taskData && taskData.TaskMessage > 0){
      embed.addFields({ name: `Mesaj Görevi`, value: `\`${TaskMember ? TaskMember.topStat : 0}/${taskData.TaskMessage} Mesaj\`` });
    }
    else {
      embed.setDescription("Mevcut bir göreviniz yok.");
    }
    
    message.channel.send({ embeds: [embed] });
  }
}