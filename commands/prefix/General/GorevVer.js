const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, StringSelectMenuBuilder, PermissionsBitField, Component} = require('discord.js');
const {Modal, TextInputComponent, showModal, SelectMenuComponent} = require("discord-modals")
let {Guild} = require("../../../config/config")
const Data = require(`../../../Schemas/Tasks`)
const User = require(`../../../Schemas/Users`)
module.exports = {
  config: {
    name: "görevver",
    description: "addtask",
  },
  permissions: ['Administrator'],
  owner: false,
  run: async (client, message, args, prefix, config) => {

 let modal = new Modal()
  .setCustomId(`MyModal`)
  .setTitle('Görev Ver')
  .addComponents(
    new TextInputComponent()
      .setCustomId('roleidd')
      .setLabel('Görev Verilicek Rol')
      .setStyle('SHORT')
      .setPlaceholder('Lütfen Rol İdsi Giriniz')
      .setRequired(true),
      new TextInputComponent()
      .setCustomId('uprole')
      .setLabel('Görevi Bitince Atlıyacağı Rol')
      .setStyle('SHORT')
      .setPlaceholder('Lütfen Rol İdsi Giriniz')
      .setRequired(true),
      new TextInputComponent()
      .setCustomId('taskname')
      .setLabel('Verilicek Görev İsmi')
      .setStyle('SHORT')
      .setPlaceholder('Ses/Mesaj')
      .setRequired(true),
      new TextInputComponent()
      .setCustomId('sessure')
      .setLabel('Lütfen Ses Süresi Seçiniz')
      .setStyle('SHORT')
      .setPlaceholder('Örn: 1 Gün / 1 Saat / 1 Dakika [İstemiyorsan 0 yaz]')
      .setRequired(true),
      new TextInputComponent()
      .setCustomId('mesaj')
      .setLabel('Lütfen Mesaj Sayısı Seç')
      .setStyle('SHORT')
      .setPlaceholder('Örn: 500 [İstemiyorsan 0 yaz]')
      .setRequired(true),
  );


 let buton = new ButtonBuilder()
 .setCustomId(`olustur`)
 .setLabel(`Görev Oluştur`)
 .setStyle(ButtonStyle.Primary)
 let buton2 = new ButtonBuilder()
 .setCustomId(`sure`)
 .setLabel(`Görevleri Berirle`)
 .setStyle(ButtonStyle.Primary)


 let row = new ActionRowBuilder().addComponents(
    buton
 )
 let embed = new EmbedBuilder()
 .setTitle("Yetkili Paneline Hoşgeldin")
 .setDescription(`\`\`\`css\nAşşağıdaki Butona Tıklayarak Görev Oluşturabilirsin\`\`\``)
 .setThumbnail(message.guild.iconURL())
 .setColor("2F3136")
message.channel.send({embeds: [embed], components: [row]})

var filter = (component) => component.user.id === message.author.id;
const collector = message.channel.createMessageComponentCollector({ filter, time: 30000 })
collector.on('collect', async (interaction) => {
if (interaction.customId == "olustur") {
    showModal(modal, {
        client: client, // Client to show the Modal through the Discord API.
        interaction: interaction, // Show the modal with interaction data.
    });

}
})
client.on('modalSubmit', async (modal) => {

let name = modal.getTextInputValue('taskname')
let roleid = modal.getTextInputValue('roleidd')
let uprole = modal.getTextInputValue('uprole')

let gorevsure = modal.getTextInputValue('sessure')
let mesaj = modal.getTextInputValue('mesaj')
let sureArr = gorevsure.split(' ')
let miliseconds = 0;
const rol = message.guild.roles.cache.get(roleid);
const uyeler = rol.members.map(m => m.user.id);
uyeler.forEach(async (userID) => {
  await User.findOneAndUpdate({ userID: userID }, { $set: { ActiveTask: "Aktif" } }, { upsert: true });
});

if(sureArr.includes('gün') || sureArr.includes('Gün')){
  let index = sureArr.findIndex(x => x == 'gün' || x == 'Gün');
  let value = sureArr[index - 1];
  miliseconds = parseInt(value) * 24 * 60 * 60 * 1000;
  let newData = await Data.findOneAndUpdate({TaskRoleId:roleid }, {$set: {TaskMembers: uyeler, Task: name, TaskRoleId: roleid, TaskMessage: mesaj, TaskSure: miliseconds, ComplatedTaskRoleUpId: uprole }}, {upsert: true}).then(() => console.log("Görev eklendi!")).catch(err => console.log(err));
}

let timeInMs = 0;
if(sureArr.includes('saat') || sureArr.includes('Saat')){
  let index = sureArr.findIndex(e => e === 'saat' || e === 'Saat')
  let hour = parseInt(sureArr[index-1])
  timeInMs = hour * 3600 * 1000
  let newData = await Data.findOneAndUpdate({TaskRoleId:roleid }, {$set: {TaskMembers: uyeler, Task: name, TaskRoleId: roleid, TaskMessage: mesaj, TaskSure: timeInMs, ComplatedTaskRoleUpId: uprole }}, {upsert: true}).then(() => console.log("Görev eklendi!")).catch(err => console.log(err));

}

let milisaniyeSure = 0;
if(sureArr.includes('dakika') || sureArr.includes('Dakika')){
  let index = sureArr.findIndex(e => e === 'dakika' || e === 'Dakika')
  let hour = parseInt(sureArr[index-1])
  milisaniyeSure += hour * 60 * 1000;
  let newData = await Data.findOneAndUpdate({TaskRoleId:roleid }, {$set: {TaskMembers: uyeler, Task: name, TaskRoleId: roleid, TaskMessage: mesaj, TaskSure: milisaniyeSure, ComplatedTaskRoleUpId: uprole }}, {upsert: true}).then(() => console.log("Görev eklendi!")).catch(err => console.log(err));

}


modal.reply({embeds: [new EmbedBuilder().setDescription(`**Başarılya Görev Verildi**`).setColor("2F3136").setThumbnail(message.guild.iconURL())]})

})
}
}

