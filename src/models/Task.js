const {Schema, model} = require('mongoose')

const TaskSchema = new Schema ({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  value: {
    type: Boolean,
    required: true
  },
  tasklist_id: {
    type: String,
    required: true
  }

}, {
  timestamps: true
})

module.exports = model('Task', TaskSchema);