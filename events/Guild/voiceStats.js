
const joinedAt = require("../../Schemas/voiceJoinedAt");
const voiceUser = require("../../Schemas/voiceUser");
const voiceGuild = require("../../Schemas/voiceGuild");
let Data = require(`../../Schemas/Tasks`)

const guildChannel = require("../../Schemas/voiceGuildChannel");
const userChannel = require("../../Schemas/voiceUserChannel");
const userParent = require("../../Schemas/voiceUserParent");
const client = require("../../index");
const User = require("../../Schemas/Users")
const TaskUserVoice = require("../../Schemas/TaskVoice")
module.exports = {
  name: "voiceStateUpdate"
}

client.on('voiceStateUpdate', async(oldState, newState) =>{

  if ((oldState.member && oldState.member.user.bot) || (newState.member && newState.member.user.bot)) return;
    let userData = await Data.findOne({TaskMembers: oldState.member.id })
    const voiceData = await TaskUserVoice.findOne({ guildID: oldState.guild.id, userID: oldState.member.id });
   
  if (!oldState.channelId && newState.channelId) await joinedAt.findOneAndUpdate({ userID: newState.id }, { $set: { date: Date.now() } }, { upsert: true });
  let joinedAtData = await joinedAt.findOne({ userID: oldState.id });
  if (!joinedAtData) await joinedAt.findOneAndUpdate({ userID: oldState.id }, { $set: { date: Date.now() } }, { upsert: true });
  joinedAtData = await joinedAt.findOne({ userID: oldState.id });
  const data = Date.now() - joinedAtData.date;

  if(userData && userData.TaskSure && voiceData && voiceData.topStat){
    if(userData.TaskSure == voiceData.topStat || voiceData.topStat > userData.TaskSure){
      await User.findOneAndUpdate({userID: oldState.member.id}, {$set:{ActiveTask: "Hayır", ComplatedTasks: 1}},{ upsert:true })
      await oldState.member.roles.add(userData.ComplatedTaskRoleUpId) 
      await oldState.member.roles.remove(userData.TaskRoleId)
      await Data.findOneAndUpdate({ TaskMembers: oldState.member.id }, { $pull: { TaskMembers: oldState.member.id } });
      await voiceData.deleteOne({ guildID: oldState.guild.id, userID: oldState.member.id })
      console.log("Görevi Silindi")
    }
  }


  if (oldState.channelId && !newState.channelId) {
    await saveData(oldState, oldState.channel, data);
    await joinedAt.deleteOne({ userID: oldState.id });
  } else if (oldState.channelID && newState.channelID) {
    await saveData(oldState, oldState.channel, data);
    await joinedAt.findOneAndUpdate({ userID: oldState.id }, { $set: { date: Date.now() } }, { upsert: true });
  }
})


async function saveData(user, channel, data) {
  let users = await User.findOne({userID: user.id})

  if(users && users.ActiveTask == "Aktif"){

    await TaskUserVoice.findOneAndUpdate({ guildID: user.guild.id, userID: user.id }, { $inc: { topStat: data} }, { upsert: true });
  }
  await voiceUser.findOneAndUpdate({ guildID: user.guild.id, userID: user.id }, { $inc: { topStat: data, dailyStat: data, weeklyStat: data, twoWeeklyStat: data } }, { upsert: true });
  await voiceGuild.findOneAndUpdate({ guildID: user.guild.id }, { $inc: { topStat: data, dailyStat: data, weeklyStat: data, twoWeeklyStat: data } }, { upsert: true });
  await guildChannel.findOneAndUpdate({ guildID: user.guild.id, channelID: channel.id }, { $inc: { channelData: data } }, { upsert: true });
  await userChannel.findOneAndUpdate({ guildID: user.guild.id, userID: user.id, channelID: channel.id }, { $inc: { channelData: data } }, { upsert: true });
  if (channel.parent) await userParent.findOneAndUpdate({ guildID: user.guild.id, userID: user.id, parentID: channel.parentID }, { $inc: { parentData: data } }, { upsert: true });
}


