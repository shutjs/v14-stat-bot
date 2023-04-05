const mongoose = require("mongoose");

const User = mongoose.model('Users', new mongoose.Schema({
    userID: String,
    ActiveTask: { type: String, default: "Hayır" },
    ComplatedTasks: Number,
  }))

  module.exports = User;