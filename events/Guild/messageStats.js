const { EmbedBuilder, PermissionsBitField, codeBlock } = require("discord.js");
const client = require("../../index");
const config = require("../../config/config");
let Data = require(`../../Schemas/Tasks`)
const messageUser = require("../../Schemas/messageUser");
const messageGuild = require("../../Schemas/messageGuild");
const guildChannel = require("../../Schemas/messageGuildChannel");
const userChannel = require("../../Schemas/messageUserChannel");
const TaskMessage = require("../../Schemas/TaskMessage");
const User = require("../../Schemas/Users")
module.exports = {
    name: "messageCreate"
}

client.on('messageCreate', async(message) => {
    if (message.author.bot) return;
    let userData = await Data.findOne({TaskMembers: message.author.id })
 let user = await User.findOne({userID: message.author.id})

const messageData = await TaskMessage.findOne({ guildID: message.guild.id, userID: message.author.id });
if(user && user.ActiveTask == "Aktif"){
  await TaskMessage.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { topStat: 1} }, { upsert: true });
}
  await messageUser.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { topStat: 1, dailyStat: 1, weeklyStat: 1, twoWeeklyStat: 1 } }, { upsert: true });
  await messageGuild.findOneAndUpdate({ guildID: message.guild.id }, { $inc: { topStat: 1, dailyStat: 1, weeklyStat: 1, twoWeeklyStat: 1 } }, { upsert: true });
  await guildChannel.findOneAndUpdate({ guildID: message.guild.id, channelID: message.channel.id }, { $inc: { channelData: 1 } }, { upsert: true });
  await userChannel.findOneAndUpdate({ guildID: message.guild.id,  userID: message.author.id, channelID: message.channel.id }, { $inc: { channelData: 1 } }, { upsert: true });
if(userData && userData.TaskMessage && messageData && messageData.topStat){
  if(userData.TaskMessage == messageData.topStat){
    await User.findOneAndUpdate({userID: message.author.id}, {$set:{ActiveTask: "Hayır", ComplatedTasks: 1}},{ upsert:true })
    await message.member.roles.add(userData.ComplatedTaskRoleUpId)
    await message.member.roles.remove(userData.TaskRoleId)
    await Data.findOneAndUpdate({ TaskMembers: message.author.id }, { $pull: { TaskMembers: message.author.id } });
    await TaskMessage.deleteOne({ guildID: message.guild.id, userID: message.author.id })
    console.log("Görevi Silindi")
  }
}
else {

  }
})
