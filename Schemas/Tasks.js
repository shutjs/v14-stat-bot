const mongoose = require("mongoose");

const Tasks = mongoose.model('Tasks', new mongoose.Schema({
    TaskRoleId: {type: String, default: "bos"},
    Task: {type: String, default: "bos"},
    TaskMembers: {type: Array },
    TaskMessage: {type: String, default: "bos"},
    TaskSure: {type: String, default: "bos"},
    ComplatedTaskRoleUpId: {type: String, default: "bos"}
  }))

  module.exports = Tasks;