const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, TextInputBuilder, TextInputStyle, StringSelectMenuBuilder, PermissionsBitField, ChannelType, SelectMenuBuilder, Component } = require('discord.js');
const client = require("../../index");
const config = require("../../config/config.js");


module.exports = {
  name: "guildMemberAdd"
};

client.on('guildMemberAdd', async (member) => {


})