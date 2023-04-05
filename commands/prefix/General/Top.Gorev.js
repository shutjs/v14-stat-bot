const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, StringSelectMenuBuilder, PermissionsBitField } = require('discord.js');
let Data = require("../../../Schemas/Users")
module.exports = {
  config: {
    name: "topgörev",
    description: "Görev Sıralaması",
  },
  permissions: ['SendMessages'],
  owner: false,
  run: async (client, message, args, prefix, config) => {
    const completedUsers = await Data.find({ ComplatedTasks: { $gt: 0 } }).sort({ ComplatedTasks: -1 }).limit(5);
    const messages = completedUsers.map((user, index) => `\`${index+1}.\` <@${user.userID}>: \`${user.ComplatedTasks}\` **Tamamlanmış görev**`).join('\n');
    console.log(messages);
    let embed = new EmbedBuilder()
    .setDescription(`${messages}`)
    .setThumbnail(message.guild.iconURL())
    .setColor("2F3136")
    .setTitle(`İşte Görevini Yapanlar!`)
    message.channel.send({embeds: [embed]})
}
}